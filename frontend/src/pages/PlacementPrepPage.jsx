import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTools, searchTools } from '../api/aiToolsApi';
import { UserContext } from '../context/UserContext';
import CodeCompiler from '../components/CodeCompiler';

const topics = [
  {
    title: 'DSA Mastery',
    description: 'Practice array, string, tree, graph and dynamic programming questions for placement tests.',
    subTopics: [
      {
        title: 'Arrays & Strings',
        detail: 'Focus on sliding window, two pointers, sorting, and hash maps for array/string problems.',
        tip: 'Solve 5 problems every day and keep notes of patterns.'
      },
      {
        title: 'Trees & Graphs',
        detail: 'Cover traversals, BFS/DFS, shortest path, topological sort and tree DP.',
        tip: 'Visualize recursive calls with handwritten examples.'
      },
      {
        title: 'Dynamic Programming',
        detail: 'Identify overlapping subproblems and use bottom-up tabulation for optimization.',
        tip: 'Start with Fibonacci and subset sum problems.'
      }
    ],
    resources: [
      { name: 'Leetcode', url: 'https://leetcode.com' },
      { name: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org' },
      { name: 'InterviewBit', url: 'https://www.interviewbit.com' }
    ]
  },
  {
    title: 'System Design & Architecture',
    description: 'Build a scalable placement portfolio with modern system design fundamentals and mock scenarios.',
    subTopics: [
      {
        title: 'Core Components',
        detail: 'Understand load balancers, caching, database sharding, and service discovery.',
        tip: 'Draw system diagrams for each design problem before coding.'
      },
      {
        title: 'Scalability & Availability',
        detail: 'Learn horizontal scaling, autoscaling groups, and failover strategies.',
        tip: 'Use real case studies like WhatsApp and Netflix.'
      },
      {
        title: 'Data Modeling',
        detail: 'Model consistent vs eventual consistency, and choose SQL/NoSQL appropriately.',
        tip: 'Explain tradeoffs clearly when discussing designs.'
      }
    ],
    resources: [
      { name: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer' },
      { name: 'Mock Interviews', url: 'https://www.pramp.com' }
    ]
  },
  {
    title: 'Behavioral Interview Prep',
    description: 'Prepare STAR answers, resume stories, and cultural fit conversations for HR rounds.',
    subTopics: [
      {
        title: 'STAR Framework',
        detail: 'Structure answers as Situation, Task, Action, Result for clarity.',
        tip: 'Practice 10 behavioral questions and write concise bullet points.'
      },
      {
        title: 'Company Research',
        detail: 'Understand mission, values, and recent news to align answers with culture.',
        tip: 'Include one company-specific fact in your interview answers.'
      }
    ],
    resources: [
      { name: 'Glassdoor Interview Questions', url: 'https://www.glassdoor.com' },
      { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning' }
    ]
  },
  {
    title: 'Resume & LinkedIn Profile',
    description: 'Create an ATS friendly resume and strong LinkedIn presence to improve placement visibility.',
    subTopics: [
      {
        title: 'ATS Optimization',
        detail: 'Use keyword matching, avoid templates with complex formatting, and keep experience concise.',
        tip: 'Use tools to scan for ATS compatibility and rework for clarity.'
      },
      {
        title: 'Impact-focused Content',
        detail: 'Write achievements with metrics and business impact (e.g., "Improved speed by 45%").',
        tip: 'Use action verbs and detail the result.'
      },
      {
        title: 'LinkedIn Branding',
        detail: 'Maintain strong headline, summary, and project descriptions.',
        tip: 'Regularly post technical posts and engage with recruiter content.'
      }
    ],
    resources: [
      { name: 'Canva Resume Templates', url: 'https://www.canva.com/resumes' },
      { name: 'Novoresume', url: 'https://novoresume.com' }
    ]
  },
  {
    title: 'Mock Interviews & Coding Challenges',
    description: 'Run timed mock tests and analyze gap areas with real companies style question sets.',
    subTopics: [
      {
        title: 'Timed Practice',
        detail: 'Attempt questions within strict time limits to simulate real test pressure.',
        tip: 'Use a timer and avoid pausing or searching online for solutions.'
      },
      {
        title: 'Post-interview Review',
        detail: 'Review mistakes, identify weak topics, and reattempt similar problems.',
        tip: 'Maintain an error log and revisit weekly.'
      }
    ],
    resources: [
      { name: 'HackerRank', url: 'https://www.hackerrank.com' },
      { name: 'CodeSignal', url: 'https://codesignal.com' }
    ]
  }
];

const toolSections = [
  {
    title: 'Resume & LinkedIn',
    description: 'Use AI tools to improve resume bullets, summaries, and profile visibility.',
    tools: [
      { name: 'Copy.ai', url: 'https://www.copy.ai', practice: 'Create 5 metric-driven resume bullets for your latest role.' },
      { name: 'Rezi.ai', url: 'https://www.rezi.ai', practice: 'Run an ATS check and implement 3 suggested keyword improvements.' },
      { name: 'LinkedIn', url: 'https://www.linkedin.com', practice: 'Rewrite your headline and summary to include role + skill keywords.' }
    ]
  },
  {
    title: 'Coding Practice',
    description: 'Practice coding daily with problems through AI-assisted platforms.',
    tools: [
      { name: 'LeetCode', url: 'https://leetcode.com', practice: 'Complete 3 medium problems and review top discussion solutions.' },
      { name: 'HackerRank', url: 'https://www.hackerrank.com', practice: 'Finish 1 hour practice track and identify weak topic areas.' },
      { name: 'CodeSignal', url: 'https://codesignal.com', practice: 'Take one General Coding Assessment and note time usage per question.' }
    ]
  },
  {
    title: 'Interview Coaching',
    description: 'Improve interview delivery with mock sessions and feedback-based practice.',
    tools: [
      { name: 'Pramp', url: 'https://www.pramp.com', practice: 'Schedule one mock interview and implement 2 feedback points.' },
      { name: 'Interviewing.io', url: 'https://www.interviewing.io', practice: 'Do one blind interview and capture improvement notes.' },
      { name: 'Glassdoor', url: 'https://www.glassdoor.com', practice: 'Review 5 company-specific interview questions and draft answers.' }
    ]
  }
];

const tasks = [
  { 
    id: 'dsa', 
    label: 'Complete DSA daily challenge', 
    topic: 'DSA Mastery',
    practiceLinks: [
      { name: 'LeetCode - Daily Challenge', url: 'https://leetcode.com/problemset/all/' },
      { name: 'HackerRank - Practice', url: 'https://www.hackerrank.com/challenges' },
      { name: 'GeeksforGeeks - DSA Questions', url: 'https://www.geeksforgeeks.org/dsa/' }
    ]
  },
  { 
    id: 'system-design', 
    label: 'Study system design fundamentals', 
    topic: 'System Design & Architecture',
    practiceLinks: [
      { name: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer' },
      { name: 'Pramp Mock Interviews', url: 'https://www.pramp.com' },
      { name: 'LeetCode Discuss', url: 'https://leetcode.com/discuss/interview-experience' }
    ]
  },
  { 
    id: 'behavioral', 
    label: 'Practice STAR answers', 
    topic: 'Behavioral Interview Prep',
    practiceLinks: [
      { name: 'Glassdoor Interview Questions', url: 'https://www.glassdoor.com/Interview' },
      { name: 'Indeed Interview Questions', url: 'https://www.indeed.com/resumes/guides/interview' },
      { name: 'GeeksforGeeks STAR Method', url: 'https://www.geeksforgeeks.org/star-method-interview' }
    ]
  },
  { 
    id: 'resume', 
    label: 'Optimize resume with AI bullets', 
    topic: 'Resume & LinkedIn Profile',
    practiceLinks: [
      { name: 'Copy.ai - Resume Generator', url: 'https://www.copy.ai' },
      { name: 'Rezi.ai - ATS Optimizer', url: 'https://www.rezi.ai' },
      { name: 'Canva Resume Templates', url: 'https://www.canva.com/resumes' }
    ]
  },
  { 
    id: 'linkedin', 
    label: 'Update LinkedIn profile', 
    topic: 'Resume & LinkedIn Profile',
    practiceLinks: [
      { name: 'LinkedIn Profile Optimization', url: 'https://www.linkedin.com/help/linkedin/answer/10532' },
      { name: 'LinkedIn Learning - Career Skills', url: 'https://www.linkedin.com/learning' },
      { name: 'LinkedIn Profile Check', url: 'https://www.linkedin.com' }
    ]
  },
  { 
    id: 'mock-interview', 
    label: 'Run 2 mock coding interviews', 
    topic: 'Mock Interviews & Coding Challenges',
    practiceLinks: [
      { name: 'Pramp - Live Mock Interviews', url: 'https://www.pramp.com' },
      { name: 'Interviewing.io - Mock Interviews', url: 'https://www.interviewing.io' },
      { name: 'CodeSignal - Coding Assessment', url: 'https://codesignal.com' }
    ]
  },
  { 
    id: 'projects', 
    label: 'Build a project with placement tools', 
    topic: 'Mock Interviews & Coding Challenges',
    practiceLinks: [
      { name: 'GitHub - Open Source Projects', url: 'https://github.com' },
      { name: 'ProjectIdea.net - Project Ideas', url: 'https://www.projectidea.net' },
      { name: 'Dev.to - Project Tutorials', url: 'https://dev.to' }
    ]
  }
];

export default function PlacementPrepPage() {
  const { user } = useContext(UserContext);
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [recommendedTools, setRecommendedTools] = useState([]);
  const [resumeTools, setResumeTools] = useState([]);
  const [codingTools, setCodingTools] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  const userKey = user ? `placementProgress-${user.username}` : 'placementProgress-guest';

  // Set selected task based on URL params
  useEffect(() => {
    if (taskId) {
      const foundTask = tasks.find(t => t.id === taskId);
      if (foundTask) {
        setSelectedTask(foundTask.topic);
      }
    } else {
      setSelectedTask(null);
    }
  }, [taskId]);

  useEffect(() => {
    const saved = localStorage.getItem(userKey);
    if (saved) {
      setCompletedTasks(JSON.parse(saved));
    }
  }, [userKey]);

  useEffect(() => {
    localStorage.setItem(userKey, JSON.stringify(completedTasks));
  }, [completedTasks, userKey]);

  useEffect(() => {
    getTools('Coding', 'popular', 0, 8).then(setRecommendedTools).catch(() => setRecommendedTools([]));
    searchTools('resume').then(setResumeTools).catch(() => setResumeTools([]));
    searchTools('coding').then(setCodingTools).catch(() => setCodingTools([]));
  }, []);

  const filtered = selectedTask 
    ? topics.filter(topic => topic.title === selectedTask)
    : topics.filter(topic =>
        topic.title.toLowerCase().includes(search.toLowerCase()) ||
        topic.description.toLowerCase().includes(search.toLowerCase())
      );

  return (
    <div className="space-y-6">
      {!selectedTask && (
        <>
          <div className="card-glass p-5 border border-slate-700 rounded-xl">
            <h1 className="text-2xl font-bold text-white">Placement Preparation Hub</h1>
            <p className="text-slate-300 mt-1">All guidance, resources, and workflows to crack campus hiring rounds.</p>
          </div>

          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Your Placement Tasks</h2>
              <p className="text-sm text-cyan-200">Completed {completedTasks.length}/{tasks.length} tasks</p>
            </div>
            {!user && <p className="text-yellow-300 text-sm mb-4">Log in to save your progress per user.</p>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map(task => (
                <div 
                  key={task.id} 
                  onClick={() => navigate(`/placement-prep/${task.id}`)}
                  className="card-glass rounded-xl border border-slate-700 p-5 hover:border-cyan-400 hover:bg-opacity-50 transition-all duration-200 cursor-pointer hover:shadow-lg hover:shadow-cyan-400/20"
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={completedTasks.includes(task.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        setCompletedTasks((s) =>
                          s.includes(task.id) ? s.filter((id) => id !== task.id) : [...s, task.id]
                        );
                      }}
                      className="mt-1 w-5 h-5 cursor-pointer"
                    />
                    <div className="flex-1">
                      <h3 className={`font-semibold text-lg ${completedTasks.includes(task.id) ? 'line-through text-slate-400' : 'text-white'}`}>
                        {task.label}
                      </h3>
                      <div className="mt-2">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${completedTasks.includes(task.id) ? 'bg-green-900 text-green-200' : 'bg-cyan-900 text-cyan-200'}`}>
                          {completedTasks.includes(task.id) ? '✓ Completed' : 'In Progress'}
                        </span>
                        <p className="text-xs text-slate-400 mt-2">Click to learn more →</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {selectedTask && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate('/placement-prep')}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
            >
              ← Back to Tasks
            </button>
            <h2 className="text-3xl font-bold text-white">{selectedTask}</h2>
          </div>
          
          <div className="space-y-4">
            {filtered.map(topic => {
              const currentTask = tasks.find(t => t.topic === selectedTask);
              return (
                <div key={topic.title} className="card-glass rounded-xl border border-slate-700 p-6">
                  <h2 className="text-2xl font-semibold text-white mb-4">{topic.title}</h2>
                  <p className="text-slate-300 mb-6">{topic.description}</p>

                  {topic.subTopics?.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-cyan-200 mb-3">Subtopics</h3>
                      <div className="space-y-3">
                        {topic.subTopics.map((sub, idx) => (
                          <div key={`${topic.title}-sub-${idx}`} className="bg-[#0f1f3b] p-4 rounded-lg border border-slate-700">
                            <h4 className="text-base font-semibold text-white">{sub.title}</h4>
                            <p className="text-sm text-slate-300 mt-1">{sub.detail}</p>
                            <p className="text-sm text-cyan-200 mt-2">💡 Tip: {sub.tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentTask?.practiceLinks && currentTask.practiceLinks.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-cyan-200 mb-3">📚 Practice Resources & Links</h3>
                      <div className="space-y-2">
                        {currentTask.practiceLinks.map(link => (
                          <a
                            key={link.url}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="block p-3 bg-[#0f1f3b] rounded-lg border border-slate-700 hover:border-cyan-400 transition-all hover:shadow-lg hover:shadow-cyan-400/20"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-cyan-300 font-medium">{link.name}</span>
                              <span className="text-cyan-400">→</span>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold text-cyan-200 mb-3">Learning Resources</h3>
                    <ul className="space-y-2">
                      {topic.resources.map(r => (
                        <li key={r.url}>
                          <a className="text-cyan-300 hover:text-cyan-200 hover:underline flex items-center gap-2" href={r.url} target="_blank" rel="noreferrer">
                            🔗 {r.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
