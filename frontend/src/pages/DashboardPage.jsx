import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Eye, Download, Calendar, Crown, BarChart3 } from 'lucide-react';
import useCVStore from '../store/cvStore';
import useAuthStore from '../store/authStore';
import { userService } from '../services/api';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { cvs, fetchCVs, deleteCV, isLoading } = useCVStore();
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchCVs();
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await userService.getStats();
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleDeleteCV = async (id) => {
    if (window.confirm('Are you sure you want to delete this CV?')) {
      try {
        await deleteCV(id);
        toast.success('CV deleted successfully');
      } catch (error) {
        toast.error('Failed to delete CV');
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your CVs and track your progress.
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="card-content flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total CVs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.cvCount}
                  <span className="text-sm font-normal text-gray-500">
                    /{stats.cvLimit === -1 ? '∞' : stats.cvLimit}
                  </span>
                </p>
              </div>
              <FileText className="h-8 w-8 text-primary-600" />
            </div>
          </div>

          <div className="card">
            <div className="card-content flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="card">
            <div className="card-content flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Downloads</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalDownloads}
                </p>
              </div>
              <Download className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="card">
            <div className="card-content flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Plan</p>
                <p className="text-2xl font-bold text-gray-900 flex items-center">
                  {stats.subscriptionType}
                  {user?.isPremium && <Crown className="h-5 w-5 text-yellow-500 ml-1" />}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Banner for Free Users */}
      {!user?.isPremium && (
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Upgrade to Premium</h3>
              <p className="text-primary-100">
                Get unlimited CVs, premium templates, and more features.
              </p>
            </div>
            <Link 
              to="/upgrade" 
              className="bg-white text-primary-600 px-6 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              Upgrade Now
            </Link>
          </div>
        </div>
      )}

      {/* CVs Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your CVs</h2>
        <Link 
          to="/cv/new" 
          className="btn btn-primary"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New CV
        </Link>
      </div>

      {/* CVs Grid */}
      {cvs.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No CVs yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first CV to get started.
          </p>
          <Link 
            to="/cv/new" 
            className="btn btn-primary"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Your First CV
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cvs.map((cv) => (
            <div key={cv._id} className="card hover:shadow-md transition-shadow">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {cv.title}
                  </h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {cv.template}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(cv.updatedAt)}
                </div>
              </div>
              <div className="card-content">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {cv.views} views
                  </div>
                  <div className="flex items-center">
                    <Download className="h-4 w-4 mr-1" />
                    {cv.downloads} downloads
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link 
                    to={`/cv/edit/${cv._id}`}
                    className="btn btn-primary flex-1 text-center"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDeleteCV(cv._id)}
                    className="btn btn-outline flex-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;