import { useEffect, useState } from 'react';

function captureConsole(execFn) {
  const oldLog = console.log;
  let output = '';
  console.log = (...args) => {
    output += args.join(' ') + '\n';
  };

  try {
    const result = execFn();
    if (result !== undefined && result !== null) {
      output += String(result) + '\n';
    }
  } catch (e) {
    output += `Error: ${e.message || e}` + '\n';
  }

  console.log = oldLog;
  return output;
}

const problems = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    constraints: '2 <= nums.length <= 10^5, -10^9 <= nums[i] <= 10^9, -10^9 <= target <= 10^9',
    sample: 'Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]',
    starterJS: `function twoSum(nums, target) {\n  // TODO: implement\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}\n\nconsole.log(twoSum([2,7,11,15], 9));`,
    starterPy: `def two_sum(nums, target):\n    # TODO: implement\n    d = {}\n    for i, num in enumerate(nums):\n        comp = target - num\n        if comp in d:\n            return [d[comp], i]\n        d[num] = i\n\nprint(two_sum([2,7,11,15], 9))`
  },
  {
    id: 'palindrome-substring',
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    description: 'Given a string s, return the longest palindromic substring in s.',
    constraints: '1 <= s.length <= 1000',
    sample: 'Input: s = "babad"\nOutput: "bab"',
    starterJS: `function longestPalindrome(s) {\n  let res = '';\n  for (let i = 0; i < s.length; i++) {\n    // expand around center\n    const expand = (left, right) => {\n      while (left >= 0 && right < s.length && s[left] === s[right]) {\n        left--;\n        right++;\n      }\n      return s.slice(left + 1, right);\n    };\n    const odd = expand(i, i);\n    const even = expand(i, i + 1);\n    if (odd.length > res.length) res = odd;\n    if (even.length > res.length) res = even;\n  }\n  return res;\n}\nconsole.log(longestPalindrome('babad'));`,
    starterPy: `def longest_palindrome(s):\n    res = ''\n    for i in range(len(s)):\n        # expand around center\n        def expand(left, right):\n            while left >= 0 and right < len(s) and s[left] == s[right]:\n                left -= 1\n                right += 1\n            return s[left+1:right]\n        odd = expand(i, i)\n        even = expand(i, i+1)\n        if len(odd) > len(res):\n            res = odd\n        if len(even) > len(res):\n            res = even\n    return res\n\nprint(longest_palindrome('babad'))`
  }
];

export default function CodeCompiler() {
  const [language, setLanguage] = useState('javascript');
  const [selectedProblem, setSelectedProblem] = useState(problems[0]);
  const [code, setCode] = useState(problems[0].starterJS);
  const [output, setOutput] = useState('');
  const [pyodide, setPyodide] = useState(null);
  const [loadingPy, setLoadingPy] = useState(language === 'python');

  const onProblemChange = (problemId) => {
    const problem = problems.find(p => p.id === problemId);
    if (problem) {
      setSelectedProblem(problem);
      setCode(language === 'python' ? problem.starterPy : problem.starterJS);
      setOutput('');
    }
  };

  const onLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(lang === 'python' ? selectedProblem.starterPy : selectedProblem.starterJS);
    setOutput('');
  };

  useEffect(() => {
    if (language !== 'python') return;

    if (window.pyodide) {
      setPyodide(window.pyodide);
      setLoadingPy(false);
      return;
    }

    setLoadingPy(true);
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js';
    script.onload = async () => {
      try {
        const py = await window.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/' });
        window.pyodide = py;
        setPyodide(py);
      } catch (e) {
        console.error(e);
        setOutput(`Pyodide initialization failed: ${e.message || e}`);
      } finally {
        setLoadingPy(false);
      }
    };
    script.onerror = () => {
      setOutput('Failed to load Pyodide.');
      setLoadingPy(false);
    };
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, [language]);

  const runCode = async () => {
    setOutput('Running...');
    if (language === 'javascript') {
      const result = captureConsole(() => eval(code));
      setOutput(result || 'Done.');
    } else if (language === 'python') {
      if (!pyodide) {
        setOutput('Python environment loading, please wait...');
        return;
      }

      try {
        let outputStr = '';
        pyodide.globals.set('print_result', (text) => {
          outputStr += `${text}\n`;
        });

        await pyodide.runPythonAsync(`import sys\nfrom js import print_result\n` +
          `class Console:\n` +
          `    def write(self, data):\n` +
          `        if data != '\\n':\n` +
          `            print_result(data)\n` +
          `    def flush(self):\n` +
          `        pass\n` +
          `sys.stdout = Console()\n` +
          `sys.stderr = Console()\n` +
          code.replaceAll('\\"', '\\"'));

        setOutput(outputStr || 'Done.');
      } catch (e) {
        setOutput(`Python Error: ${e}`);
      }
    }
  };

  return (
    <div className="card-glass p-4 rounded-xl border border-slate-700">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="col-span-1 md:col-span-1">
            <label className="text-sm text-slate-300">Problem</label>
            <select value={selectedProblem.id} onChange={e => onProblemChange(e.target.value)} className="w-full bg-[#0f172a] border border-slate-600 text-slate-200 px-2 py-1 rounded">
              {problems.map(problem => (
                <option key={problem.id} value={problem.id}>{problem.title} ({problem.difficulty})</option>
              ))}
            </select>
          </div>

          <div className="col-span-1 md:col-span-1">
            <label className="text-sm text-slate-300" htmlFor="lang">Language</label>
            <select id="lang" value={language} onChange={e => onLanguageChange(e.target.value)} className="w-full bg-[#0f172a] border border-slate-600 text-slate-200 px-2 py-1 rounded">
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>
          </div>

          <div className="col-span-1 md:col-span-1 flex items-end">
            <button onClick={runCode} className="w-full bg-[#2563eb] text-white px-3 py-2 rounded hover:bg-[#1e40af]">Run</button>
          </div>
        </div>

        <div className="bg-[#0b1225] p-3 rounded border border-slate-700">
          <p className="text-slate-100 font-semibold">Description</p>
          <p className="text-slate-300 text-sm mt-1">{selectedProblem.description}</p>
          <p className="text-slate-100 font-semibold mt-2">Constraints</p>
          <p className="text-slate-300 text-sm">{selectedProblem.constraints}</p>
          <p className="text-slate-100 font-semibold mt-2">Example</p>
          <p className="text-slate-300 text-sm whitespace-pre-wrap">{selectedProblem.sample}</p>
        </div>

        <textarea
          className="h-56 w-full bg-[#0f172a] text-slate-100 p-3 rounded border border-slate-600"
          value={code}
          onChange={e => setCode(e.target.value)}
        />
        {language === 'python' && loadingPy && (
          <p className="text-yellow-300">Loading Python runtime...</p>
        )}
        <div className="bg-[#111f42] text-slate-200 p-3 rounded min-h-[120px] whitespace-pre-wrap font-mono">
          {output}
        </div>
      </div>
    </div>
  );
}
