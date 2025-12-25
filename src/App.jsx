import React, { useState, useEffect } from 'react';
import './App.css';
import logo from './assets/logo.png';

export default function App() {
    const [videoData, setVideoData] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisComplete, setAnalysisComplete] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [activeTab, setActiveTab] = useState('overview');
    const [aiInsights, setAiInsights] = useState(null);
    const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

    useEffect(() => {
        console.log("videoData state was updated:", videoData);
    }, [videoData]);

    const analysisSteps = [
        "🔍 Scanning video metadata...",
        "📊 Analyzing engagement metrics...",
        "🎯 Processing video content...",
        "🧠 Generating AI insights...",
        "✨ Finalizing analysis..."
    ];

    const analyzeCurrentVideo = async () => {
        setIsAnalyzing(true);
        setAnalysisComplete(false);
        setCurrentStep(0);
        setVideoData(null);
        setAiInsights(null);

        // 1. Get the current tab's URL
        if (window.chrome && chrome.tabs) {
            chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
                const currentTab = tabs[0];
                if (!currentTab || !currentTab.url || !currentTab.url.includes("youtube.com/watch")) {
                    alert("This is not a YouTube video page.");
                    setIsAnalyzing(false);
                    return;
                }

                // Simulate the analysis steps
                for (let i = 0; i < analysisSteps.length; i++) {
                    setCurrentStep(i);
                    await new Promise(resolve => setTimeout(resolve, 800));
                }

                try {
                    // 2. Send the URL to the backend
                    const response = await fetch('http://localhost:3002/analyze', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ url: currentTab.url }),
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    setVideoData(data);
                } catch (error) {
                    console.error("Failed to fetch video data:", error);
                    // Optionally, handle the error in the UI
                } finally {
                    setIsAnalyzing(false);
                    setAnalysisComplete(true);
                }
            });
        } else {
            // Fallback for development outside of Chrome extension
            console.log("Not running in a Chrome extension, using mock URL.");
            // You can add mock behavior here if you want to test outside the extension
            setIsAnalyzing(false);
        }
    };

    const handleTabClick = async (tab) => {
        setActiveTab(tab);
        if (tab === 'insights' && videoData && !aiInsights) {
            setIsGeneratingInsights(true);
            try {
                const response = await fetch('http://localhost:3002/generate-insights', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: videoData.title,
                        description: videoData.description,
                        statistics: videoData.engagement,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setAiInsights(data);
            } catch (error) {
                console.error("Failed to fetch AI insights:", error);
                setAiInsights({ summary: "Failed to generate AI insights.", insights: [] });
            } finally {
                setIsGeneratingInsights(false);
            }
        }
    };

    const resetAnalysis = () => {
        setVideoData(null);
        setAnalysisComplete(false);
        setIsAnalyzing(false);
        setCurrentStep(0);
        setActiveTab('overview');
        setAiInsights(null);
    };

    const exportReport = () => {
        if (!videoData) {
            alert("No data to export.");
            return;
        }

        // 1. Format the data into a string
        const reportContent = `
YouTube Video Analysis Report
-----------------------------

Title: ${videoData.title}
Channel: ${videoData.channel}

--- Statistics ---
Views: ${videoData.views}
Likes: ${videoData.likes}
Like Ratio: ${videoData.engagement.likeRatio}%
Comments: ${videoData.engagement.commentCount}
Uploaded: ${videoData.uploadDate}

--- Tags ---
${videoData.tags.join(', ')}

--- Description ---
${videoData.description}

--- AI Summary ---
${aiInsights ? aiInsights.summary : 'No summary generated.'}

--- AI Insights ---
${aiInsights ? aiInsights.insights.join('\n') : 'No insights generated.'}
        `;

        // 2. Create a Blob from the string
        const blob = new Blob([reportContent], { type: 'text/plain' });

        // 3. Create a temporary URL for the blob
        const url = URL.createObjectURL(blob);

        // 4. Create a temporary anchor element and trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${videoData.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`; // Create a safe filename
        document.body.appendChild(a);
        a.click();

        // 5. Clean up by removing the temporary element and URL
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="app">
            <div className="floating-particles">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="particle"></div>
                ))}
            </div>

            <div className="content">
                <div className="header">
                    <div className="logo">
                        <img src={logo} className="logo-icon" alt="logo" />
                        <h1 className="title">{analysisComplete ? 'Video Insights Dashboard' : 'YouTube Video Analyzer'}</h1>
                    </div>
                    <p className="subtitle">AI-driven video insights</p>
                </div>

                {!isAnalyzing && !analysisComplete && (
                    <div className="welcome-section">
                        <div className="glass-card">
                            <div className="welcome-content">
                                <div className="feature-icon">📊</div>
                                <h3>Analyze Any YouTube Video</h3>
                                <p>Get detailed insights, engagement metrics, and AI-powered analysis of any YouTube video instantly.</p>

                                <button
                                    className="analyze-btn"
                                    onClick={analyzeCurrentVideo}
                                >
                                    <span className="btn-icon">🔍</span>
                                    Analyze Current Video
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {isAnalyzing && (
                    <div className="analysis-section">
                        <div className="glass-card">
                            <div className="analysis-progress">
                                <div className="progress-header">
                                    <div className="spinner"></div>
                                    <h3>Analyzing Video...</h3>
                                </div>

                                <div className="progress-steps">
                                    {analysisSteps.map((step, index) => (
                                        <div
                                            key={index}
                                            className={`step ${index <= currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                                        >
                                            <div className="step-indicator"></div>
                                            <span className="step-text">{step}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${((currentStep + 1) / analysisSteps.length) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {analysisComplete && videoData && (
                    <div className="results-section">
                        <div className="video-header glass-card">
                            <div className="video-thumbnail">
                                <img src={videoData.thumbnail} alt="Video thumbnail" />
                                <div className="duration-badge">{videoData.duration}</div>
                            </div>
                            <div className="video-info">
                                <h3 className="video-title">{videoData.title}</h3>
                                <p className="channel-name">{videoData.channel}</p>
                                <div className="video-stats">
                                    <span className="stat">👀 {videoData.views}</span>
                                    <span className="stat">👍 {videoData.likes}</span>
                                    <span className="stat">📅 {videoData.uploadDate}</span>
                                </div>
                            </div>
                        </div>

                        <div className="tabs-container">
                            <div className="tabs">
                                <button
                                    className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                                    onClick={() => handleTabClick('overview')}
                                >
                                    📊 Overview
                                </button>
                                <button
                                    className={`tab ${activeTab === 'insights' ? 'active' : ''}`}
                                    onClick={() => handleTabClick('insights')}
                                >
                                    🧠 Insights
                                </button>
                                <button
                                    className={`tab ${activeTab === 'tags' ? 'active' : ''}`}
                                    onClick={() => handleTabClick('tags')}
                                >
                                    🏷️ Tags
                                </button>
                            </div>

                            <div className="tab-content glass-card">
                                {activeTab === 'overview' && (
                                    <div className="overview-content">
                                        <div className="engagement-metrics">
                                            <div className="metric">
                                                <div className="metric-label">Like Ratio</div>
                                                <div className="metric-value">{videoData.engagement.likeRatio}%</div>
                                                <div className="metric-bar">
                                                    <div
                                                        className="metric-fill"
                                                        style={{ width: `${videoData.engagement.likeRatio}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div className="metric">
                                                <div className="metric-label">Comments</div>
                                                <div className="metric-value">{videoData.engagement.commentCount}</div>
                                            </div>
                                            <div className="metric">
                                                <div className="metric-label">Sub Growth</div>
                                                <div className="metric-value positive">{videoData.engagement.subscriberGrowth}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'insights' && (
                                    <div className="insights-content">
                                        {isGeneratingInsights && (
                                            <div className="spinner"></div>
                                        )}
                                        {aiInsights && (
                                            <div>
                                                <h4>AI Summary</h4>
                                                <p>{aiInsights.summary}</p>
                                                <br />
                                                <h4>AI Insights</h4>
                                                <div className="insights-list">
                                                    {aiInsights.insights.map((insight, index) => (
                                                        <div key={index} className="insight-item">
                                                            {insight}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'tags' && (
                                    <div className="tags-content">
                                        <div className="tags-list">
                                            {videoData.tags.map((tag, index) => (
                                                <span key={index} className="tag">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="description">
                                            <h4>Description Preview</h4>
                                            <p>{videoData.description}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="action-buttons">
                            <button className="secondary-btn" onClick={resetAnalysis}>
                                🔄 New Analysis
                            </button>
                            <button className="primary-btn" onClick={exportReport}>
                                📤 Export Report
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}