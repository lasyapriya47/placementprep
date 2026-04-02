import { useContext, useEffect, useState } from 'react';
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
  { id: 'dsa', label: 'Complete DSA daily challenge' },
  { id: 'system-design', label: 'Study system design fundamentals' },
  { id: 'behavioral', label: 'Practice STAR answers' },
  { id: 'resume', label: 'Optimize resume with AI bullets' },
  { id: 'linkedin', label: 'Update LinkedIn profile' },
  { id: 'mock-interview', label: 'Run 2 mock coding interviews' },
  { id: 'projects', label: 'Build a project with placement tools' }
];

export default function PlacementPrepPage() {
  const { user } = useContext(UserContext);
  const [search, setSearch] = useState('');
  const [recommendedTools, setRecommendedTools] = useState([]);
  const [resumeTools, setResumeTools] = useState([]);
  const [codingTools, setCodingTools] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  const userKey = user ? `placementProgress-${user.username}` : 'placementProgress-guest';

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

  const filtered = topics.filter(topic =>
    topic.title.toLowerCase().includes(search.toLowerCase()) ||
    topic.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="card-glass p-5 border border-slate-700 rounded-xl">
        <h1 className="text-2xl font-bold text-white">Placement Preparation Hub</h1>
        <p className="text-slate-300 mt-1">All guidance, resources, and workflows to crack campus hiring rounds.</p>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search planning topics..."
          className="mt-4 w-full bg-[#111f42] border border-slate-600 text-slate-200 px-3 py-2 rounded-lg"
        />
      </div>

      <div className="card-glass rounded-xl border border-slate-700 p-4">
        <h2 className="text-xl font-semibold text-white">Placement Progress Tracker</h2>
        {!user && <p className="text-yellow-300 text-sm">Log in to save your progress per user.</p>}
        <ul className="mt-3 space-y-2 text-slate-200">
          {tasks.map(task => (
            <li className="flex items-center" key={task.id}>
              <input
                type="checkbox"
                checked={completedTasks.includes(task.id)}
                onChange={() => {
                  setCompletedTasks((s) =>
                    s.includes(task.id) ? s.filter((id) => id !== task.id) : [...s, task.id]
                  );
                }}
                className="mr-2"
              />
              <span className={completedTasks.includes(task.id) ? 'line-through text-slate-400' : ''}>{task.label}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-cyan-200 mt-2">Completed {completedTasks.length}/{tasks.length} tasks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(topic => (
          <div key={topic.title} className="card-glass rounded-xl border border-slate-700 p-4">
            <h2 className="text-xl font-semibold text-white">{topic.title}</h2>
            <p className="text-slate-300 mt-1 mb-2">{topic.description}</p>

            {topic.subTopics?.length > 0 && (
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-cyan-200">Subtopics</h3>
                <div className="mt-2 space-y-2">
                  {topic.subTopics.map((sub, idx) => (
                    <div key={`${topic.title}-sub-${idx}`} className="bg-[#0f1f3b] p-3 rounded-lg border border-slate-700">
                      <h4 className="text-sm font-semibold text-white">{sub.title}</h4>
                      <p className="text-xs text-slate-300">{sub.detail}</p>
                      <p className="text-xs text-cyan-200">Tip: {sub.tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold text-cyan-200">Resources</h3>
              <ul className="list-disc ml-6 space-y-1 mt-1">
                {topic.resources.map(r => (
                  <li key={r.url}><a className="text-cyan-200 hover:underline" href={r.url} target="_blank" rel="noreferrer">{r.name}</a></li>
                ))}
              </ul>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-slate-300">No placement topics found for "{search}".</div>
        )}
      </div>

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-white">AI Tools for Placement</h2>
        <p className="text-slate-300 mt-1">Recommended AI tools to improve resume, LinkedIn, coding practice and interview prep.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {toolSections.map(section => (
            <div key={section.title} className="card-glass p-4 rounded-xl border border-slate-700">
              <h3 className="font-semibold text-white">{section.title}</h3>
              <p className="text-xs text-slate-300 mb-2">{section.description}</p>
              <ul className="list-disc ml-5 mt-1 text-cyan-200">
                {section.tools.map(tool => (
                  <li key={tool.url} className="mb-1">
                    <a href={tool.url} target="_blank" rel="noreferrer" className="hover:underline">{tool.name}</a>
                    <p className="text-[11px] text-slate-300 mt-1">Practice activity: {tool.practice}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h3 className="mt-6 text-lg font-semibold text-white">Feeds from your data</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-3">
          <div className="card-glass p-3 rounded-xl border border-slate-700">
            <p className="text-sm text-cyan-200 font-semibold">Resume AI Tools</p>
            {resumeTools.slice(0, 4).map(tool => (
              <p key={tool.id} className="text-slate-200 text-xs">• {tool.name}</p>
            ))}
          </div>
          <div className="card-glass p-3 rounded-xl border border-slate-700">
            <p className="text-sm text-cyan-200 font-semibold">Coding AI Tools</p>
            {codingTools.slice(0, 4).map(tool => (
              <p key={tool.id} className="text-slate-200 text-xs">• {tool.name}</p>
            ))}
          </div>
          <div className="card-glass p-3 rounded-xl border border-slate-700">
            <p className="text-sm text-cyan-200 font-semibold">Popular Coding Tools</p>
            {recommendedTools.slice(0, 4).map(tool => (
              <p key={tool.id} className="text-slate-200 text-xs">• {tool.name}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-white">Mock Tests & Practice Questions</h2>
        <ul className="list-disc ml-5 mt-3 text-cyan-200 space-y-2">
          <li>Data structures: two-sum, longest substring w/out repeating chars, binary tree in-order traversal</li>
          <li>Algorithms: quick sort partition, n-queens backtracking, Dijkstra shortest path</li>
          <li>System design: design a URL shortener, design a chat app, design an e-commerce checkout service</li>
          <li>Behavioral: STAR answers for teamwork/conflict/biggest failure, strengths, and career goals</li>
          <li>Resume task: optimize bullet points with quant metrics and action verbs</li>
        </ul>
        <p className="text-slate-300 mt-3">Top mock test sites: <a href="https://www.hackerrank.com" className="text-cyan-200 hover:underline" target="_blank" rel="noreferrer">HackerRank</a>, <a href="https://leetcode.com" className="text-cyan-200 hover:underline" target="_blank" rel="noreferrer">LeetCode</a>, <a href="https://www.interviewbit.com" className="text-cyan-200 hover:underline" target="_blank" rel="noreferrer">InterviewBit</a>.</p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-white">Interactive Coding Questions + In-browser Compiler</h2>
        <p className="text-slate-300 mt-2">Code directly inside the app and run JS/Python without leaving this page.</p>

        <div className="mt-4">
          <CodeCompiler />
        </div>

        <div className="space-y-4 mt-6">
          <div className="card-glass rounded-xl p-4 border border-slate-700">
            <h3 className="font-semibold text-white">1) Two-sum (Easy)</h3>
            <p className="text-cyan-200 text-sm">Given an integer array and target, return indices of two numbers that add up to target.</p>
          </div>
          <div className="card-glass rounded-xl p-4 border border-slate-700">
            <h3 className="font-semibold text-white">2) Longest Palindromic Substring (Medium)</h3>
            <p className="text-cyan-200 text-sm">Find the longest palindromic substring in a given string.</p>
          </div>
          <div className="card-glass rounded-xl p-4 border border-slate-700">
            <h3 className="font-semibold text-white">3) Merge Intervals (Medium)</h3>
            <p className="text-cyan-200 text-sm">Given intervals, merge all overlapping intervals.</p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-white">AI-powered Mock Interview Questions for HR/Tech Rounds</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="card-glass rounded-xl border border-slate-700 p-4">
            <h3 className="font-semibold text-white">General HR</h3>
            <ol className="ml-5 mt-2 text-cyan-200 list-decimal space-y-1">
              <li>Tell me about yourself with a focus on your last project.</li>
              <li>Explain a challenging situation and how you handled it.</li>
              <li>How do you prioritize tasks under tight deadlines?</li>
              <li>What makes you a good fit for this role/company?</li>
            </ol>
          </div>
          <div className="card-glass rounded-xl border border-slate-700 p-4">
            <h3 className="font-semibold text-white">Technical Coding</h3>
            <ol className="ml-5 mt-2 text-cyan-200 list-decimal space-y-1">
              <li>How would you optimize or refactor this code for performance?</li>
              <li>Write pseudo code for handling large-scale data streaming.</li>
              <li>Describe tradeoffs between recursion and iteration.</li>
              <li>Explain REST vs GraphQL in practical API design.</li>
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}
