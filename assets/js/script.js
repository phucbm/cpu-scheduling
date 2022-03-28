console.clear();

class Process{
    constructor(options){
        this.name = options.name || ''; // process name

        this.burst_time = options.burst_time || 0; // CPU time

        this.queue_time = options.queue_time || 0; // time to start using CPU

        // 1: new
        // 2: ready (for CPU burst)
        // 3: running
        // 4: waiting (or blocked, waiting for I/O
        // 5: terminated
        this.status = 'new'; // also known as process context

        //this.pid = ''; // process identifier

        // preemptive, non-preemptive
        this.decision_mode = 'preemptive';


        this.waiting_time = 0;
    }
}

class Scheduling{
    constructor(options){
        this.processes = options.processes || []; // list of processes


        // check process's names if empty
        this.processes.forEach((p, i) => {
            p.name = p.name.length ? p.name : `P${i + 1}`;
        });
        console.table(this.processes)

        // FCFS, SJF, RR
        this.algorithms = options.algorithms || ['FCFS'];

        // run algorithm
        this.algorithms.forEach((a, i) => {
            this.schedule_history = [];
            this.cpu_time = 0;
            this.total_waiting_time = 0;

            switch(a){
                case 'FCFS':
                    this.fcfs();
                    break;
            }

            console.table(this.schedule_history);
            console.log('Total CPU time:', this.cpu_time);
            console.log('Total waiting time:', this.total_waiting_time);
            console.log('Average waiting time:', this.awt());

            console.log('Done!')
        });
    }

    // average waiting time
    awt(){
        return this.total_waiting_time / this.processes.length;
    }

    fcfs(){
        const name = 'First Come First Served (FCFS)';
        console.log('Scheduling algorithm:', name)

        // sort by queue time
        this.processes = sortArrayByObjectValue(this.processes, 'queue_time');

        // process one by one
        this.processes.forEach((p, i) => {
            p.waiting_time = this.cpu_time;

            // save to schedule history
            this.schedule_history.push({
                process: p.name,
                waiting_time: p.waiting_time,
                cpu_start: this.cpu_time,
                cpu_end: this.cpu_time + p.burst_time,
            });

            // update schedule data
            this.cpu_time += p.burst_time;
            this.total_waiting_time += p.waiting_time;
        });
    }
}

// Question 1
const cpu_scheduling = new Scheduling({
    algorithms: ['FCFS'],
    processes: [
        new Process({queue_time: 0, burst_time: 10}),
        new Process({queue_time: 2, burst_time: 1}),
        new Process({queue_time: 3, burst_time: 5}),
        new Process({queue_time: 1, burst_time: 1}),
        new Process({queue_time: 4, burst_time: 5}),
    ]
});