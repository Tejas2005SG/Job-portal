import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import HeroSection from './HeroSection';
import CategoryCarousel from './CategoryCarousel';
import LatestJobs from './LatestJobs';
import Footer from './shared/Footer';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bot, X } from 'lucide-react';

const GEMINI_API_KEY = 'AIzaSyDyujm50dHMYvn1V50dDDqcAhgUqCOuUGU';
const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();

  // Chatbot states
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate("/admin/companies");
    }
  }, []);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = { text: chatInput, isUser: true };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_ENDPOINT}?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `You are a general-purpose assistant with knowledge across all topics. Answer the following query to the best of your ability: ${chatInput}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Check if the response contains the expected data
      if (response.data && response.data.candidates && response.data.candidates[0].content) {
        const aiResponse = response.data.candidates[0].content.parts[0].text;
        setChatMessages(prev => [...prev, { text: aiResponse, isUser: false }]);
      } else {
        throw new Error('Unexpected response structure from Gemini API');
      }
    } catch (error) {
      console.error('Error fetching Gemini API:', error.response ? error.response.data : error.message);
      setChatMessages(prev => [
        ...prev,
        { text: 'Sorry, I encountered an error. Please try again later.', isUser: false },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="relative">
      <Navbar />
      <HeroSection />
      <CategoryCarousel />
      <LatestJobs />
      <Footer />

      {/* Chatbot Toggle Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-5 right-5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 z-50 flex items-center gap-2"
      >
        <Bot className="w-6 h-6" />
        <span className="hidden md:inline text-sm font-medium">Chat Assistant</span>
      </button>

      {/* Chatbot Window */}
      {isChatOpen && (
        <div className="fixed bottom-20 right-5 w-96 bg-white rounded-xl shadow-2xl p-5 z-40 animate-fade-in border border-gray-200">
          {/* Chatbot Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-indigo-500" />
              <h3 className="text-lg font-semibold text-gray-800">Chat Assistant</h3>
            </div>
            <button onClick={toggleChat} className="text-gray-500 hover:text-gray-700 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="h-80 overflow-y-auto mb-4 bg-gray-50 rounded-lg p-4 space-y-3">
            {chatMessages.length === 0 ? (
              <div className="text-center text-gray-500">
                <p className="text-sm">Welcome! Ask me anything.</p>
              </div>
            ) : (
              chatMessages.map((message, index) => (
                <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                      message.isUser
                        ? 'bg-indigo-500 text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-600 p-3 rounded-lg rounded-bl-none">
                  <span className="animate-pulse">Typing...</span>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleChatSubmit} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="px-4 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all disabled:bg-indigo-300"
              disabled={isLoading}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Home;