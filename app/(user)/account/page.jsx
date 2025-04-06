import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Portal Access</h1>
        
        <p className="text-gray-600 mb-8">
          Welcome to the portal selection page. Please select your destination below.
        </p>
        
        <div className="flex flex-col space-y-4">
          <Link href="/admin" className="w-full">
            <button className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200">
              <ShieldCheck size={20} />
              <span>Go to Admin Portal</span>
            </button>
          </Link>
          
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
            Return to Home
          </Link>
        </div>
      </div>
      
      <footer className="mt-8 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Your Company. All rights reserved.
      </footer>
    </main>
  );
}



// "use client"
// import { useState } from "react";
// import { User, Settings, CreditCard, Mail, Bell, Lock, LogOut } from "lucide-react";

// export default function Page() {
//   const [user, setUser] = useState({
//     name: "Madhusudhan Sharma",
//     email: "Madhusudhansha.com",
//     avatar: "/api/placeholder/80/80",
//     role: "Premium Member",
//     joined: "January 2023"
//   });

//   const [activeTab, setActiveTab] = useState("profile");

//   return (
//     <main className="p-5 max-w-6xl mx-auto py-15">
//       <div className="flex flex-col md:flex-row gap-8">
//         {/* Sidebar */}
//         <aside className="w-full md:w-64 shrink-0">
//           <div className="bg-white rounded-lg shadow p-4 mb-4">
//             <div className="flex flex-col items-center mb-4">
//               <img 
//                 src={user.avatar} 
//                 alt="Profile picture" 
//                 className="w-20 h-20 rounded-full mb-2"
//               />
//               <h2 className="font-bold text-lg">{user.name}</h2>
//               <p className="text-gray-500 text-sm">{user.role}</p>
//             </div>
//             <div className="border-t pt-3">
//               <p className="text-sm text-gray-500">Member since {user.joined}</p>
//             </div>
//           </div>
          
//           <nav className="bg-white rounded-lg shadow overflow-hidden">
//             <button 
//               onClick={() => setActiveTab("profile")}
//               className={`flex items-center w-full p-3 text-left ${activeTab === "profile" ? "bg-blue-50 text-blue-600" : ""}`}
//             >
//               <User size={18} className="mr-2" />
//               Profile
//             </button>
//             <button 
//               onClick={() => setActiveTab("payment")}
//               className={`flex items-center w-full p-3 text-left ${activeTab === "payment" ? "bg-blue-50 text-blue-600" : ""}`}
//             >
//               <CreditCard size={18} className="mr-2" />
//               Payment Methods
//             </button>
//             <button 
//               onClick={() => setActiveTab("notifications")}
//               className={`flex items-center w-full p-3 text-left ${activeTab === "notifications" ? "bg-blue-50 text-blue-600" : ""}`}
//             >
//               <Bell size={18} className="mr-2" />
//               Notifications
//             </button>
//             <button 
//               onClick={() => setActiveTab("security")}
//               className={`flex items-center w-full p-3 text-left ${activeTab === "security" ? "bg-blue-50 text-blue-600" : ""}`}
//             >
//               <Lock size={18} className="mr-2" />
//               Security
//             </button>
//             <button 
//               className="flex items-center w-full p-3 text-left text-red-600 hover:bg-red-50"
//             >
//               <LogOut size={18} className="mr-2" />
//               Sign Out
//             </button>
//           </nav>
//         </aside>

//         {/* Main Content */}
//         <div className="flex-1 bg-white rounded-lg shadow p-6">
//           {activeTab === "profile" && (
//             <>
//               <div className="flex items-center justify-between mb-6">
//                 <h1 className="text-2xl font-bold">Profile Information</h1>
//                 <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Edit Profile</button>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-500">Full Name</label>
//                   <div className="mt-1 text-lg">{user.name}</div>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-500">Email</label>
//                   <div className="mt-1 text-lg flex items-center">
//                     <Mail size={16} className="mr-2 text-gray-400" />
//                     {user.email}
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-500">Membership</label>
//                   <div className="mt-1 text-lg">{user.role}</div>
//                 </div>
                
//                 <div className="pt-4 border-t">
//                   <h3 className="font-medium mb-2">Connected Accounts</h3>
//                   <div className="flex space-x-2">
//                     <button className="px-3 py-1 border rounded-md hover:bg-gray-50">
//                       Connect Google
//                     </button>
//                     <button className="px-3 py-1 border rounded-md hover:bg-gray-50">
//                       Connect Facebook
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}

//           {activeTab === "payment" && (
//             <>
//               <h1 className="text-2xl font-bold mb-6">Payment Methods</h1>
//               <div className="border rounded-md p-4 mb-4">
//                 <div className="flex justify-between items-center">
//                   <div className="flex items-center">
//                     <CreditCard className="mr-3 text-gray-400" />
//                     <div>
//                       <div className="font-medium">Visa ending in 4242</div>
//                       <div className="text-sm text-gray-500">Expires 12/2025</div>
//                     </div>
//                   </div>
//                   <div>
//                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                       Default
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               <button className="flex items-center text-blue-600 font-medium">
//                 <span className="mr-1">+</span> Add Payment Method
//               </button>
//             </>
//           )}

//           {activeTab === "notifications" && (
//             <>
//               <h1 className="text-2xl font-bold mb-6">Notification Settings</h1>
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between py-2 border-b">
//                   <div>
//                     <h3 className="font-medium">Email Notifications</h3>
//                     <p className="text-sm text-gray-500">Receive updates via email</p>
//                   </div>
//                   <label className="relative inline-flex items-center cursor-pointer">
//                     <input type="checkbox" className="sr-only peer" defaultChecked />
//                     <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                   </label>
//                 </div>
                
//                 <div className="flex items-center justify-between py-2 border-b">
//                   <div>
//                     <h3 className="font-medium">Push Notifications</h3>
//                     <p className="text-sm text-gray-500">Receive notifications on your device</p>
//                   </div>
//                   <label className="relative inline-flex items-center cursor-pointer">
//                     <input type="checkbox" className="sr-only peer" />
//                     <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                   </label>
//                 </div>
                
//                 <div className="flex items-center justify-between py-2 border-b">
//                   <div>
//                     <h3 className="font-medium">Marketing Emails</h3>
//                     <p className="text-sm text-gray-500">Receive promotional content</p>
//                   </div>
//                   <label className="relative inline-flex items-center cursor-pointer">
//                     <input type="checkbox" className="sr-only peer" defaultChecked />
//                     <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                   </label>
//                 </div>
//               </div>
//             </>
//           )}

//           {activeTab === "security" && (
//             <>
//               <h1 className="text-2xl font-bold mb-6">Security Settings</h1>
//               <div className="space-y-6">
//                 <div>
//                   <h3 className="text-lg font-medium mb-2">Change Password</h3>
//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">Current Password</label>
//                       <input type="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">New Password</label>
//                       <input type="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
//                       <input type="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
//                     </div>
//                     <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Update Password</button>
//                   </div>
//                 </div>
                
//                 <div className="pt-6 border-t">
//                   <h3 className="text-lg font-medium mb-2">Two-Factor Authentication</h3>
//                   <p className="text-gray-500 mb-2">Add an extra layer of security to your account</p>
//                   <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Enable 2FA</button>
//                 </div>
                
//                 <div className="pt-6 border-t">
//                   <h3 className="text-lg font-medium mb-2">Login Sessions</h3>
//                   <p className="text-gray-500 mb-2">Manage your active sessions</p>
//                   <div className="border rounded-md p-3">
//                     <div className="flex justify-between items-center">
//                       <div>
//                         <div className="font-medium">Current Session</div>
//                         <div className="text-sm text-gray-500">Chrome on Windows • New York, USA</div>
//                       </div>
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                         Active Now
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </main>
//   );
// }