"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useReportStore } from "@/app/store/Report";
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from "recharts";
import styles from "@/app/styles/report.module.css";

export default function Report() {
  const [timeframe, setTimeframe] = useState("Weekly");
  const [reportData, setReportData] = useState({
    overview: { totalProfit: 0, revenue: 0, sales: 0, netPurchaseValue: 0 },
    chartData: [],
    categoryData: [],
    productData: []
  });

  // Get methods from the store
  const { 
    getSalesReports, 
    getProductReports, 
    getCategoryReports, 
    getPaymentMethodReports,
    getInventoryValuationReport,
    loading,
    error,
    salesReports,
    productReports,
    categoryReports,
    paymentReports,
    inventoryValuation
  } = useReportStore();

  useEffect(() => {
    // Fetch all report data when component mounts or timeframe changes
    const fetchReportData = async () => {
      try {
        // Show loading toast
        const loadingToast = toast.loading('Loading report data...');
        
        // Get sales reports
        const salesResult = await getSalesReports({
          period: timeframe.toLowerCase()
        });
        
        // Get product reports
        const productResult = await getProductReports({
          limit: 10,
          sortBy: 'totalSales',
          order: 'desc'
        });
        
        // Get category reports
        const categoryResult = await getCategoryReports({
          limit: 5
        });
        
        // Get payment reports
        const paymentResult = await getPaymentMethodReports();
        
        // Get inventory valuation
        const inventoryResult = await getInventoryValuationReport();
        
        // Dismiss loading toast
        toast.dismiss(loadingToast);
        
        if (!salesResult.success || !productResult.success || !categoryResult.success) {
          toast.error("Failed to load some report data");
        } else {
          toast.success("Report data loaded successfully");
        }
      } catch (err) {
        toast.error("Error loading report data: " + (err.message || "Unknown error"));
      }
    };

    fetchReportData();
  }, [timeframe, getSalesReports, getProductReports, getCategoryReports, getPaymentMethodReports, getInventoryValuationReport]);

  // Process data when store values change
  useEffect(() => {
    if (salesReports && productReports && categoryReports && inventoryValuation) {
      // Process chart data from sales reports
      const chartData = salesReports.map(item => ({
        name: item.period,
        Revenue: item.totalRevenue,
        Profit: item.totalProfit
      }));
      
      // Get top selling products
      const topProducts = productReports ? productReports.slice(0, 4).map(item => ({
        product: item.name,
        productId: item.id,
        category: item.category,
        remainingQuantity: item.stock ? `${item.stock} ${item.unit || ''}` : "",
        turnOver: `$${item.totalSales.toLocaleString()}`,
        increaseBy: `${item.growthRate.toFixed(1)}%`,
        increaseColor: item.growthRate >= 0 ? "#10b981" : "#ef4444"
      })) : [];
      
      // Get top selling categories
      const topCategories = categoryReports ? categoryReports.slice(0, 3).map(item => ({
        category: item.name,
        turnOver: `$${item.totalSales.toLocaleString()}`,
        increaseBy: `${item.growthRate.toFixed(1)}%`,
        increaseColor: item.growthRate >= 0 ? "#10b981" : "#ef4444"
      })) : [];
      
      // Calculate overview data
      let totalProfit = 0;
      let totalRevenue = 0;
      let totalSales = 0;
      
      if (salesReports && salesReports.length > 0) {
        totalProfit = salesReports.reduce((sum, item) => sum + item.totalProfit, 0);
        totalRevenue = salesReports.reduce((sum, item) => sum + item.totalRevenue, 0);
        totalSales = salesReports.reduce((sum, item) => sum + item.orderCount, 0);
      }
      
      // Set all processed data
      setReportData({
        overview: {
          totalProfit,
          revenue: totalRevenue,
          sales: totalSales,
          netPurchaseValue: inventoryValuation ? inventoryValuation.totalValue : 0
        },
        chartData: chartData.length > 0 ? chartData : [
          { name: 'Sep', Revenue: 21000, Profit: 12000 },
          { name: 'Oct', Revenue: 38000, Profit: 23000 },
          { name: 'Nov', Revenue: 30000, Profit: 20000 },
          { name: 'Dec', Revenue: 45000, Profit: 30000 },
          { name: 'Jan', Revenue: 52000, Profit: 35000 },
          { name: 'Feb', Revenue: 42000, Profit: 28000 },
          { name: 'Mar', Revenue: 40000, Profit: 26000 },
        ],
        categoryData: topCategories.length > 0 ? topCategories : [
          { category: "Machine", turnOver: "$26,000", increaseBy: "3.2%", increaseColor: "#10b981" },
          { category: "Spare parts", turnOver: "$22,000", increaseBy: "2%", increaseColor: "#10b981" },
          { category: "Tools", turnOver: "$22,000", increaseBy: "1.5%", increaseColor: "#10b981" },
        ],
        productData: topProducts.length > 0 ? topProducts : [
          { product: "Hydraulic", productId: "23567", category: "Machine", remainingQuantity: "225 kg", turnOver: "$17,000", increaseBy: "2.3%", increaseColor: "#10b981" },
          { product: "Steering", productId: "25831", category: "Machine", remainingQuantity: "200 kg", turnOver: "$12,000", increaseBy: "1.3%", increaseColor: "#10b981" },
          { product: "Belt", productId: "56841", category: "Tool", remainingQuantity: "", turnOver: "$10,000", increaseBy: "1.3%", increaseColor: "#10b981" },
          { product: "Bearing", productId: "23567", category: "Spare parts", remainingQuantity: "125 Packet", turnOver: "$9,000", increaseBy: "1%", increaseColor: "#10b981" },
        ]
      });
    }
  }, [salesReports, productReports, categoryReports, paymentReports, inventoryValuation]);

  // Handle timeframe toggle
  const handleTimeframeChange = () => {
    const newTimeframe = timeframe === "Weekly" ? "Monthly" : "Weekly";
    setTimeframe(newTimeframe);
  };

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>{label}</p>
          <p className={styles.tooltipValue}>${payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  // Handle export report
  const handleExportReport = () => {
    try {
      const exportPromise = useReportStore.getState().exportSalesReports({
        period: timeframe.toLowerCase(),
        format: 'csv'
      });
      
      toast.promise(exportPromise, {
        loading: 'Exporting report...',
        success: 'Report exported successfully',
        error: 'Failed to export report'
      });
    } catch (err) {
      toast.error("Failed to export report");
    }
  };

  return (
    <div className={styles.reportContainer}>
      {loading && <div className={styles.loadingOverlay}>Loading reports...</div>}
      
      {/* Overview Section */}
      <div className={styles.overviewSection}>
        <div className={styles.sectionHeader}>
          <h2>Overview</h2>
          <button 
            onClick={handleExportReport} 
            className={styles.exportButton}
            disabled={loading}
          >
            Export Report
          </button>
        </div>
        <div className={styles.overviewCards}>
          <div className={styles.overviewCard}>
            <div className={styles.cardValue}>${reportData.overview.totalProfit.toLocaleString()}</div>
            <div className={styles.cardLabel}>Total Profit</div>
          </div>
          <div className={`${styles.overviewCard}`}>
            <div className={`${styles.cardValue} ${styles.orange}`}>${reportData.overview.revenue.toLocaleString()}</div>
            <div className={`${styles.cardLabel} ${styles.orange}`}>Revenue</div>
          </div>
          <div className={styles.overviewCard}>
            <div className={`${styles.cardValue} ${styles.purple}`}>{reportData.overview.sales.toLocaleString()}</div>
            <div className={`${styles.cardLabel} ${styles.purple}`}>Sales</div>
          </div>
          <div className={styles.overviewCard}>
            <div className={styles.cardValue}>${reportData.overview.netPurchaseValue.toLocaleString()}</div>
            <div className={styles.cardLabel}>Net purchase value</div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className={styles.chartSection}>
        <div className={styles.sectionHeader}>
          <h2>Profit & Revenue</h2>
          <div className={styles.timeframeToggle}>
            <label className={styles.timeframeLabel}>
              <input
                type="checkbox"
                checked={timeframe === "Weekly"}
                onChange={handleTimeframeChange}
                disabled={loading}
              />
              <span className={styles.checkmark}></span>
              Weekly
            </label>
          </div>
        </div>
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={reportData.chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                domain={[0, 'dataMax + 10000']}
                tickFormatter={(value) => `${value.toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="Revenue"
                stroke="#3b82f6"
                dot={false}
                activeDot={{ r: 8, stroke: "#3b82f6", strokeWidth: 2, fill: "#fff" }}
                strokeWidth={3}
              />
              <Line
                type="monotone"
                dataKey="Profit"
                stroke="#a855f7"
                dot={false}
                activeDot={{ r: 8, stroke: "#a855f7", strokeWidth: 2, fill: "#fff" }}
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className={styles.chartLegend}>
            <div className={styles.legendItem}>
              <div className={`${styles.legendDot} ${styles.blue}`}></div>
              <span>Revenue</span>
            </div>
            <div className={styles.legendItem}>
              <div className={`${styles.legendDot} ${styles.purple}`}></div>
              <span>Profit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Best Selling Categories */}
      <div className={styles.tableSection}>
        <div className={styles.sectionHeader}>
          <h2>Best selling category</h2>
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Category</th>
                <th>Turn Over</th>
                <th>Increase By</th>
              </tr>
            </thead>
            <tbody>
              {reportData.categoryData.map((item, index) => (
                <tr key={index}>
                  <td>{item.category}</td>
                  <td>{item.turnOver}</td>
                  <td>
                    <span className={styles.increaseValue} style={{ color: item.increaseColor }}>
                      {item.increaseBy}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Best Selling Products */}
      <div className={styles.tableSection}>
        <div className={styles.sectionHeader}>
          <h2>Best selling product</h2>
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Product ID</th>
                <th>Category</th>
                <th>Remaining Quantity</th>
                <th>Turn Over</th>
                <th>Increase By</th>
              </tr>
            </thead>
            <tbody>
              {reportData.productData.map((item, index) => (
                <tr key={index}>
                  <td>{item.product}</td>
                  <td>{item.productId}</td>
                  <td>{item.category}</td>
                  <td>{item.remainingQuantity}</td>
                  <td>{item.turnOver}</td>
                  <td>
                    <span className={styles.increaseValue} style={{ color: item.increaseColor }}>
                      {item.increaseBy}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}