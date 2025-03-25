import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import AmazonLogo from "../assets/logos/amazon.svg";
import AppleLogo from "../assets/logos/apple.svg";
import FacebookLogo from "../assets/logos/facebook.svg";
import GoogleLogo from "../assets/logos/google.svg";
import MicrosoftLogo from "../assets/logos/microsoft.svg";
import TeslaLogo from "../assets/logos/tesla.svg";

// Animation component that will wrap each section
const AnimateOnScroll = ({ children, threshold = 0.2 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only trigger once
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      {
        threshold, // Percentage of element that needs to be visible
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isVisible, threshold]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-900 ease-out ${
        isVisible
          ? "opacity-100 transform translate-y-0 scale-100"
          : "opacity-0 transform translate-y-10 scale-95"
      }`}
    >
      {children}
    </div>
  );
};

const HomePage = () => {
  const { isAuthenticated, currentUser } = useContext(AuthContext);

  // Determine the dashboard link based on user role
  const getDashboardLink = () => {
    if (!currentUser) return "/login";

    switch (currentUser.role) {
      case "company":
        return "/company-dashboard";
      case "admin":
        return "/admin-dashboard";
      default:
        return "/user-dashboard";
    }
  };

  // Testimonial data
  const testimonials = [
    {
      id: 1,
      name: "Sandip Shrestha",
      position: "Data Analyst",
      company: "Microsoft",
      content:
        "Elevate Workforce helped me find my dream role in just two weeks! The platform was intuitive and connected me with companies that truly matched my skills and aspirations.",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    },
    {
      id: 2,
      name: "Ashish Baniya",
      position: "Cloud Enginerr",
      company: "Amazon",
      content:
        "As a hiring manager, Elevate Workforce has revolutionized our recruitment process. The quality of candidates we've found has exceeded our expectations.",
      avatar: "https://randomuser.me/api/portraits/men/41.jpg",
    },
    {
      id: 3,
      name: "Ayush Gurung",
      position: "Software Enginerr",
      company: "Google",
      content:
        "After months of job searching on other platforms, I found my perfect match within days on Elevate Workforce. The personalized job recommendations were spot on!",
      avatar: "https://randomuser.me/api/portraits/women/63.jpg",
    },
  ];

  // Top companies
  const topCompanies = [
    { id: 1, name: "Google", logo: GoogleLogo },
    { id: 2, name: "Amazon", logo: AmazonLogo },
    { id: 3, name: "Apple", logo: AppleLogo },
    { id: 4, name: "Microsoft", logo: MicrosoftLogo },
    { id: 5, name: "Meta", logo: FacebookLogo },
    { id: 6, name: "Tesla", logo: TeslaLogo },
  ];

  // Job categories
  const jobCategories = [
    { id: 1, name: "Technology", icon: "💻", count: 1420 },
    { id: 2, name: "Marketing", icon: "📊", count: 840 },
    { id: 3, name: "Finance", icon: "💰", count: 650 },
    { id: 4, name: "Healthcare", icon: "🏥", count: 920 },
    { id: 5, name: "Education", icon: "🎓", count: 540 },
    { id: 6, name: "Design", icon: "🎨", count: 380 },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Elevate Workforce
          </Link>

          <div className="space-x-4">
            {isAuthenticated() ? (
              <Link
                to={getDashboardLink()}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white hover:bg-gray-100 text-blue-500 border border-blue-500 font-bold py-2 px-4 rounded"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto py-20 px-4">
          <AnimateOnScroll>
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6">
                Your Career Journey Starts Here
              </h1>
              <p className="text-xl mb-8">
                Connect with top companies and discover opportunities that match
                your skills, experience, and career goals.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/register"
                  className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
                >
                  Get Started
                </Link>
                <Link
                  to={isAuthenticated() ? getDashboardLink() : "/register"}
                  className="bg-transparent hover:bg-blue-700 text-white border border-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
                >
                  Browse Jobs
                </Link>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-8 shadow-md">
        <div className="container mx-auto px-4">
          <AnimateOnScroll>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4">
                <p className="text-3xl font-bold text-blue-600">10,000+</p>
                <p className="text-gray-600">Active Jobs</p>
              </div>
              <div className="p-4">
                <p className="text-3xl font-bold text-blue-600">5,000+</p>
                <p className="text-gray-600">Companies</p>
              </div>
              <div className="p-4">
                <p className="text-3xl font-bold text-blue-600">1 Million+</p>
                <p className="text-gray-600">Job Seekers</p>
              </div>
              <div className="p-4">
                <p className="text-3xl font-bold text-blue-600">89%</p>
                <p className="text-gray-600">Success Rate</p>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Top Companies Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <AnimateOnScroll>
            <h2 className="text-3xl font-bold text-center mb-12">
              Trusted by Top Companies
            </h2>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {topCompanies.map((company) => (
                <div
                  key={company.id}
                  className="bg-white p-6 shadow-md rounded-lg flex items-center justify-center"
                >
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    className="max-h-12"
                  />
                </div>
              ))}
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <div className="mt-12 text-center">
              <Link
                to="/#"
                className="text-blue-600 hover:underline font-semibold"
              >
                View all partner companies →
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Job Categories Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <AnimateOnScroll>
            <h2 className="text-3xl font-bold text-center mb-4">
              Explore Job Categories
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Discover opportunities across various industries and find the
              perfect role that matches your skills and interests.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobCategories.map((category) => (
                <Link
                  key={category.id}
                  to="#"
                  className="bg-gray-50 hover:bg-blue-50 p-6 rounded-lg shadow-sm transition duration-300 border border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl mb-2">{category.icon}</p>
                      <h3 className="text-xl font-semibold">{category.name}</h3>
                      <p className="text-gray-600">
                        {category.count} open positions
                      </p>
                    </div>
                    <div className="bg-blue-100 text-blue-600 rounded-full w-10 h-10 flex items-center justify-center">
                      <span className="text-xl">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <AnimateOnScroll>
            <h2 className="text-3xl font-bold text-center mb-12">
              How It Works
            </h2>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  Create Your Profile
                </h3>
                <p className="text-gray-600">
                  Sign up and build your professional profile with your skills,
                  experience, and career goals.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  Explore Opportunities
                </h3>
                <p className="text-gray-600">
                  Browse through thousands of job listings or receive
                  personalized recommendations based on your profile.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Apply & Connect</h3>
                <p className="text-gray-600">
                  Apply to jobs with a single click and connect directly with
                  employers interested in your profile.
                </p>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <AnimateOnScroll>
            <h2 className="text-3xl font-bold text-center mb-4">
              Success Stories
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Hear from job seekers and employers who found success through
              Elevate Workforce.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-gray-50 p-8 rounded-lg shadow-sm"
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={`/api/placeholder/60/60`}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-gray-600 text-sm">
                        {testimonial.position}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">{testimonial.content}</p>
                  <div className="mt-4 text-yellow-500">★★★★★</div>
                </div>
              ))}
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll>
            <div className="mt-12 text-center">
              <Link
                to="/#"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
              >
                Read More Success Stories
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <AnimateOnScroll>
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have found their dream jobs
              through Elevate Workforce. Create your account today and unlock a
              world of opportunities.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-8 rounded-lg text-lg transition duration-300"
              >
                Create Account
              </Link>
              <Link
                to="/register"
                className="bg-transparent hover:bg-blue-700 text-white border border-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300"
              >
                For Employers
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <AnimateOnScroll threshold={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Elevate Workforce</h2>
                <p className="text-gray-400 mb-4">
                  Connecting talent with opportunity since 2020. We're on a
                  mission to help people find jobs they love and companies find
                  talent they need.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white">
                    <span className="sr-only">Facebook</span>
                    FB
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <span className="sr-only">Twitter</span>
                    TW
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <span className="sr-only">LinkedIn</span>
                    LI
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <span className="sr-only">Instagram</span>
                    IG
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">For Job Seekers</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Browse Jobs
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Career Resources
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Resume Builder
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Salary Calculator
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Job Alerts
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">For Employers</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Post a Job
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Browse Candidates
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Pricing Plans
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Recruitment Solutions
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Company Branding
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Blog
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </AnimateOnScroll>

          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} Elevate Workforce. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
