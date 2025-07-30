import React from 'react';
import { User, Mail, Settings, Crown } from 'lucide-react';
import useAuthStore from '../store/authStore';

const ProfilePage = () => {
  const { user } = useAuthStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </h2>
            </div>
            <div className="card-content space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    className="input"
                    defaultValue={user?.firstName}
                    placeholder="First name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    className="input"
                    defaultValue={user?.lastName}
                    placeholder="Last name"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="input"
                  defaultValue={user?.email}
                  placeholder="Email address"
                />
              </div>
              
              <div className="flex justify-end">
                <button className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Security
              </h2>
            </div>
            <div className="card-content space-y-4">
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Enter current password"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Enter new password"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Confirm new password"
                />
              </div>
              
              <div className="flex justify-end">
                <button className="btn btn-primary">
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Info */}
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Crown className="h-5 w-5 mr-2" />
                Subscription
              </h2>
            </div>
            <div className="card-content">
              <div className="text-center py-4">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  user?.isPremium 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {user?.isPremium && <Crown className="h-4 w-4 mr-1" />}
                  {user?.subscriptionType || 'Free'}
                </div>
                
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <p>CVs: {user?.cvLimit === -1 ? 'Unlimited' : `${user?.cvLimit} max`}</p>
                  <p>Downloads: {user?.downloadLimit === -1 ? 'Unlimited' : `${user?.downloadLimit}/month`}</p>
                </div>
                
                {!user?.isPremium && (
                  <div className="mt-6">
                    <button className="btn btn-primary w-full">
                      Upgrade to Premium
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">
                Account Actions
              </h2>
            </div>
            <div className="card-content space-y-3">
              <button className="btn btn-outline w-full text-left justify-start">
                Export Data
              </button>
              <button className="btn btn-outline w-full text-left justify-start">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;