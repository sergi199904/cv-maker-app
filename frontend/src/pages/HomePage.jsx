import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Users, Download, Star, CheckCircle, ArrowRight } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: FileText,
      title: 'Professional Templates',
      description: 'Choose from carefully designed templates that make your CV stand out to employers.'
    },
    {
      icon: Users,
      title: 'Easy to Use',
      description: 'Our intuitive interface guides you through creating your CV step by step.'
    },
    {
      icon: Download,
      title: 'Instant Download',
      description: 'Download your CV as a PDF instantly, ready to send to employers.'
    },
    {
      icon: Star,
      title: 'Real-time Preview',
      description: 'See exactly how your CV will look as you edit it in real-time.'
    }
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '0',
      period: 'forever',
      features: [
        'Up to 3 CVs',
        '1 basic template',
        '5 downloads per month',
        'PDF export',
        'Basic support'
      ],
      cta: 'Get Started',
      link: '/register',
      popular: false
    },
    {
      name: 'Premium',
      price: '9.99',
      period: 'month',
      features: [
        'Unlimited CVs',
        'All premium templates',
        'Unlimited downloads',
        'Multiple formats (PDF, Word)',
        'Priority support',
        'Advanced customization'
      ],
      cta: 'Start Free Trial',
      link: '/register?plan=premium',
      popular: true
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Create Your Perfect
              <span className="text-primary-600"> CV</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Build professional CVs that get you hired. Choose from beautiful templates, 
              customize with ease, and download instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="btn btn-primary px-8 py-4 text-lg"
              >
                Start Creating Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                to="/templates" 
                className="btn btn-outline px-8 py-4 text-lg"
              >
                View Templates
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose CV Maker?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We make it simple to create professional CVs that help you land your dream job.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start free and upgrade when you need more features.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`card ${plan.popular ? 'ring-2 ring-primary-500 shadow-lg' : ''}`}
              >
                {plan.popular && (
                  <div className="bg-primary-500 text-white text-center py-2 rounded-t-lg">
                    Most Popular
                  </div>
                )}
                <div className="card-header text-center">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                </div>
                <div className="card-content">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link 
                    to={plan.link}
                    className={`btn w-full ${plan.popular ? 'btn-primary' : 'btn-outline'}`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Create Your CV?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who have already created their perfect CV.
          </p>
          <Link 
            to="/register" 
            className="bg-white text-primary-600 px-8 py-4 rounded-md font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            Get Started for Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;