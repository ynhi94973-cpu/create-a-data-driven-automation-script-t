interface AutomationScript {
  id: number;
  name: string;
  description: string;
  script: string; // The actual script content
  triggers: string[]; // List of triggers that will run the script
  created_at: Date;
  updated_at: Date;
  runs: AutomationScriptRun[];
}

interface AutomationScriptRun {
  id: number;
  automation_script_id: number;
  started_at: Date;
  finished_at: Date;
  status: 'success' | 'failed';
  output: string; // Output of the script run
}

class AutomationScriptTracker {
  private scripts: AutomationScript[] = [];
  private runs: AutomationScriptRun[] = [];

  addScript(script: AutomationScript) {
    this.scripts.push(script);
  }

  getScript(id: number) {
    return this.scripts.find((script) => script.id === id);
  }

  runScript(id: number) {
    const script = this.getScript(id);
    if (!script) throw new Error(`Script with id ${id} not found`);
    const run: AutomationScriptRun = {
      id: this.runs.length + 1,
      automation_script_id: id,
      started_at: new Date(),
      finished_at: null,
      status: 'running',
      output: '',
    };
    this.runs.push(run);
    try {
      // Run the script here, assume it returns a string output
      const output = script.script;
      run.finished_at = new Date();
      run.status = 'success';
      run.output = output;
    } catch (error) {
      run.finished_at = new Date();
      run.status = 'failed';
      run.output = error.message;
    }
  }

  getScriptRuns(id: number) {
    return this.runs.filter((run) => run.automation_script_id === id);
  }
}

const tracker = new AutomationScriptTracker();

// Example usage
const script: AutomationScript = {
  id: 1,
  name: 'My Script',
  description: 'This is a sample script',
  script: 'console.log("Hello World!")',
  triggers: ['cron:0 0 * * * *'],
  created_at: new Date(),
  updated_at: new Date(),
  runs: [],
};

tracker.addScript(script);

tracker.runScript(1);

console.log(tracker.getScriptRuns(1));