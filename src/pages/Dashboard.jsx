import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Chart from 'react-apexcharts';
import { LuPackage, LuShoppingCart, LuDollarSign, LuTrendingUp, LuWallet } from 'react-icons/lu';
import { get_products } from '../store/Reducers/productReducer';
import { get_orders } from '../store/Reducers/orderReducer';
import { get_payment_stats } from '../store/Reducers/paymentReducer';

const card = { background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:"16px", backdropFilter:"blur(10px)" };

const gradients = {
  green:  "linear-gradient(135deg,rgba(34,197,94,.15),rgba(34,197,94,.05))",
  blue:   "linear-gradient(135deg,rgba(79,142,247,.15),rgba(79,142,247,.05))",
  purple: "linear-gradient(135deg,rgba(168,85,247,.15),rgba(168,85,247,.05))",
  amber:  "linear-gradient(135deg,rgba(245,158,11,.15),rgba(245,158,11,.05))",
  teal:   "linear-gradient(135deg,rgba(20,184,166,.15),rgba(20,184,166,.05))",
};
const icons = { green:"#22c55e", blue:"#4f8ef7", purple:"#a855f7", amber:"#f59e0b", teal:"#14b8a6" };

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="p-5 rounded-2xl relative overflow-hidden" style={card}>
      <div className="absolute inset-0 opacity-100" style={{ background: gradients[color] }} />
      <div className="relative z-10">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${icons[color]}22` }}>
          <Icon className="text-lg" style={{ color: icons[color] }} />
        </div>
        <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">{label}</p>
        <h2 className="text-white text-2xl font-bold mt-1">{value}</h2>
      </div>
    </div>
  );
}

const pColors = { paid:"#22c55e", unpaid:"#ef4444", pending:"#eab308", failed:"#ef4444" };
const dColors = { delivered:"#22c55e", processing:"#4f8ef7", shipped:"#a855f7", pending:"#eab308", cancelled:"#ef4444" };

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sellerInfo } = useSelector(s => s.sellerAuth);
  const { products, totalItems: totalProducts } = useSelector(s => s.product);
  const { orders, totalItems: totalOrders } = useSelector(s => s.order);
  const { stats } = useSelector(s => s.payment);

  useEffect(() => { if (!localStorage.getItem('accessToken')) navigate('/seller/login'); }, []);
  useEffect(() => { dispatch(get_products({ page:1, perPage:100, search:'' })); }, [dispatch]);
  // Fetch only 5 most recent orders for dashboard
  useEffect(() => { dispatch(get_orders({ page:1, perPage:5, search:'' })); }, [dispatch]);
  useEffect(() => { dispatch(get_payment_stats()); }, [dispatch]);

  const totalRevenue = orders.reduce((s, o) => s + (o.totalPrice || o.price || 0), 0);
  const discountedProducts = products.filter(p => p.discount > 0).length;

  // Monthly chart from orders
  const monthlyRevenue = Array(12).fill(0);
  const monthlyOrders = Array(12).fill(0);
  orders.forEach(o => {
    if (o.createdAt) {
      const m = new Date(o.createdAt).getMonth();
      monthlyRevenue[m] += o.totalPrice || 0;
      monthlyOrders[m] += 1;
    }
  });

  const lineOptions = {
    chart: { background:'transparent', toolbar:{ show:false }, fontFamily:'Inter, sans-serif' },
    colors: ['#4f8ef7','#a855f7'],
    stroke: { curve:'smooth', width:3 },
    fill: { type:'gradient', gradient:{ opacityFrom:0.25, opacityTo:0.02 } },
    dataLabels: { enabled:false },
    grid: { borderColor:'rgba(255,255,255,0.06)', strokeDashArray:4 },
    xaxis: { categories:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], labels:{ style:{ colors:'#6b7280', fontSize:'11px' } }, axisBorder:{ show:false }, axisTicks:{ show:false } },
    yaxis: { labels:{ style:{ colors:'#6b7280', fontSize:'11px' } } },
    legend: { labels:{ colors:'#9ca3af' } },
    tooltip: { theme:'dark' },
  };
  const lineSeries = [
    { name:'Revenue ($)', data: monthlyRevenue },
    { name:'Orders', data: monthlyOrders },
  ];

  const donutOptions = {
    chart: { background:'transparent', fontFamily:'Inter, sans-serif' },
    colors: ['#4f8ef7','#a855f7','#22c55e'],
    labels: ['Active','Inactive','Pending'],
    legend: { position:'bottom', labels:{ colors:'#9ca3af' } },
    stroke: { width:0 },
    tooltip: { theme:'dark' },
    plotOptions: { pie:{ donut:{ size:'65%' } } },
  };
  const donutSeries = [
    products.filter(p => p.status==='active').length || 0,
    products.filter(p => p.status==='inactive').length || 0,
    products.filter(p => !p.status || p.status==='pending').length || 0,
  ];

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-white text-2xl font-bold">Welcome back, {sellerInfo?.name?.split(' ')[0] || 'Seller'} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Here's your store performance at a glance.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard icon={LuDollarSign}   label="Total Revenue"    value={`$${totalRevenue.toFixed(2)}`}           color="green" />
        <StatCard icon={LuWallet}       label="Available Balance" value={`$${(stats.netBalance||0).toFixed(2)}`} color="teal" />
        <StatCard icon={LuShoppingCart} label="Total Orders"     value={totalOrders}                              color="blue" />
        <StatCard icon={LuPackage}      label="Total Products"   value={totalProducts}                            color="purple" />
        <StatCard icon={LuTrendingUp}   label="On Discount"      value={discountedProducts}                       color="amber" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 p-5 rounded-2xl" style={card}>
          <h3 className="text-white font-semibold mb-1">Revenue & Orders</h3>
          <p className="text-gray-500 text-xs mb-4">Monthly overview — {new Date().getFullYear()}</p>
          <Chart options={lineOptions} series={lineSeries} type="area" height={250} />
        </div>
        <div className="p-5 rounded-2xl" style={card}>
          <h3 className="text-white font-semibold mb-1">Product Status</h3>
          <p className="text-gray-500 text-xs mb-4">Breakdown by status</p>
          {products.length > 0
            ? <Chart options={donutOptions} series={donutSeries} type="donut" height={250} />
            : <div className="flex items-center justify-center h-[250px] text-gray-500 text-sm">No product data yet</div>
          }
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl p-5" style={card}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Recent Orders</h3>
          <span className="text-gray-500 text-xs">Last 5 orders</span>
        </div>
        {orders.length === 0
          ? <p className="text-gray-500 text-sm text-center py-8">No orders yet</p>
          : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr style={{ borderBottom:"1px solid rgba(255,255,255,.06)" }}>
                    {['Order ID','Customer','Total','Payment','Delivery'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide pb-3 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id} style={{ borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                      <td className="py-3 pr-4"><span className="text-blue-400 text-sm font-mono">#{String(order._id).slice(-6).toUpperCase()}</span></td>
                      <td className="py-3 pr-4"><span className="text-white text-sm">{order.customerName || '—'}</span></td>
                      <td className="py-3 pr-4"><span className="text-white font-semibold text-sm">${order.totalPrice || 0}</span></td>
                      <td className="py-3 pr-4">
                        <span className="px-2 py-1 rounded-lg text-xs font-semibold capitalize"
                          style={{ color: pColors[order.paymentStatus] || '#eab308', background:`${pColors[order.paymentStatus] || '#eab308'}18` }}>
                          {order.paymentStatus || 'pending'}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-1 rounded-lg text-xs font-semibold capitalize"
                          style={{ color: dColors[order.deliveryStatus] || '#eab308', background:`${dColors[order.deliveryStatus] || '#eab308'}18` }}>
                          {order.deliveryStatus || 'pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </div>
    </div>
  );
}

export default Dashboard;
