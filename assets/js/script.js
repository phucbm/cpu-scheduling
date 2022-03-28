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
        this.decision_mode = 'non-preemptive';


        this.waiting_time = 0;

        this.remaining_time = this.burst_time;
    }
}

class Scheduling{
    constructor(options){
        this.processes = options.processes || []; // list of processes
        this.quantum_time = options.quantum_time || 1;

        // check process's names if empty
        this.processes.forEach((p, i) => {
            p.name = p.name.length ? p.name : `P${i + 1}`;
        });
        console.log('List of processes:')
        console.table(this.processes)

        // FCFS, SJF, RR
        this.algorithm = options.algorithm || 'FCFS';

        // run algorithm
        this.schedule_history = [];
        this.cpu_time = 0;
        this.total_waiting_time = 0;
        this.algorithm_name = '';

        switch(this.algorithm){
            case 'FCFS':
                this.fcfs();
                break;
            case 'SJF':
                this.sjf();
                break;
            case 'RR':
                this.rr();
                break;
            default:
                this.fcfs();
        }


        console.log('---------> Scheduling algorithm:', this.algorithm_name)

        console.table(this.schedule_history);
        console.log('Total CPU time:', this.cpu_time);
        console.log('Total waiting time:', this.total_waiting_time);
        console.log('Average waiting time:', this.awt());

        console.log('Done!')
    }

    // average waiting time
    awt(){
        return this.total_waiting_time / this.processes.length;
    }

    fcfs(processes = this.processes){
        this.algorithm_name = 'First Come First Served (FCFS)';

        // sort by queue time
        processes = sortArrayByObjectValue(processes, 'queue_time');

        // exe
        this.execute_processes(processes);
    }

    sjf(processes = this.processes){
        this.algorithm_name = 'Shortest-Job-First (SJF)';

        // sort by burst time
        processes = sortArrayByObjectValue(processes, 'burst_time');

        // exe
        this.execute_processes(processes);
    }

    rr(processes = this.processes){
        this.algorithm_name = 'Round Robin (RR)';

        // process by quantum time
        let is_finished = processes.filter(p => p.status !== 'terminated').length;
        while(is_finished > 0){
            processes.forEach((p, i) => {
                if(p.status === 'terminated') return;

                const cpu_time_needed = Math.min(p.remaining_time, this.quantum_time);
                p.status = 'running';
                p.waiting_time += this.cpu_time;
                p.remaining_time -= cpu_time_needed;

                if(p.remaining_time === 0 && p.status !== 'terminated'){
                    p.status = 'terminated';
                    is_finished--;
                }

                // save to schedule history
                this.schedule_history.push({
                    process: p.name,
                    waiting_time: p.waiting_time,
                    cpu_start: this.cpu_time,
                    cpu_end: this.cpu_time + cpu_time_needed,
                    status: p.status
                });

                // update schedule data
                this.cpu_time += cpu_time_needed;
                this.total_waiting_time += p.waiting_time;
            });
        }
    }

    execute_processes(processes = this.processes){
        // process one by one
        processes.forEach((p, i) => {
            p.waiting_time += this.cpu_time;
            p.remaining_time -= p.burst_time;
            p.status = 'terminated';

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
// const cpu_scheduling = new Scheduling({
//     algorithms: ['FCFS', 'SJF', 'RR'],
//     quantum_time: 2,
//     processes: [
//         new Process({queue_time: 0, burst_time: 10}),
//         new Process({queue_time: 2, burst_time: 1}),
//         new Process({queue_time: 3, burst_time: 5}),
//         new Process({queue_time: 1, burst_time: 1}),
//         new Process({queue_time: 4, burst_time: 5}),
//     ]
// });

const cpu_scheduling = new Scheduling({
    algorithm: 'RR',
    quantum_time: 20,
    processes: [
        new Process({burst_time: 53}),
        new Process({burst_time: 17}),
        new Process({burst_time: 68}),
        new Process({burst_time: 24}),
    ]
});