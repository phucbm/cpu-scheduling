class Scheduling{
    constructor(options){
        this.quantum_time = options.quantum_time || 99999999;
        this.processes = options.processes || []; // list of processes

        // check process's names if empty
        this.processes.forEach((p, i) => {
            p.name = p.name.length ? p.name : `P${i + 1}`;
        });

        console.log('List of processes:')
        console.table(this.processes)

        // FCFS, SJF, RR
        this.algorithm = options.algorithm || 'FCFS';

        // run algorithm
        this.terminated_count = 0;
        this.queue = [];
        this.current_cpu_time = 0;
        this.total_waiting_time = 0;
        this.total_TAT = 0;
        this.total_RT = 0;
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


        console.log('--------> Scheduling algorithm:', this.algorithm_name)

        console.table(this.queue);
        console.log('Total CPU time:', this.current_cpu_time);
        console.log('Total waiting time:', this.total_waiting_time);
        console.log('Average waiting time:', this.awt());
        console.log('Throughput:', this.throughput());
        console.log('Average TAT:', this.atat());
        console.log('Average RT:', this.art());

        console.log('Done! <---------')
        console.log('')
    }

    art(){
        return this.total_RT / this.processes.length;
    }

    atat(){
        return this.total_TAT / this.processes.length;
    }

    // average waiting time
    awt(){
        return this.total_waiting_time / this.processes.length;
    }


    // average waiting time
    throughput(){
        return Math.round(this.processes.length / this.current_cpu_time * 10000) / 10000;
    }


    // return the process with the shortest CPU burst
    s(processes){
        // get all ready processes
        const ready_processes = processes.filter(p => p.arrival_time <= this.current_cpu_time && p.status === 'new');
        if(ready_processes.length === 1) return ready_processes[0];

        // get min burst time
        const min_burst_time = Math.min(...ready_processes.map(p => p.burst_time));
        const min_processes = ready_processes.filter(p => p.burst_time === min_burst_time);
        if(min_processes.length === 1) return min_processes[0];

        // get the min process that comes first
        const sorted_min_processes = sortArrayByObjectValue(min_processes, 'arrival_time');
        return sorted_min_processes[0];
    }


    /**
     * Process Control Block
     * @param p
     */
    processControl(p){
        if(p.status === 'terminated') return;

        // run this process
        let status_history = p.status;
        if(p.status === 'new'){
            // run time
            p.run_time = this.current_cpu_time;

            // response time
            p.response_time = p.run_time - p.arrival_time;

            // total RT
            this.total_RT += p.response_time;

            p.status = 'ready';
            status_history += ` > ${p.status}`;
        }
        p.status = 'running';
        status_history += ` > ${p.status}`;

        const cpu_time_needed = Math.min(p.remaining_time, p.burst_time, this.quantum_time);

        // waiting time
        if(p.waiting_time === 0){
            p.waiting_time = this.current_cpu_time - p.arrival_time;
        }else{
            p.waiting_time += this.current_cpu_time - p.completion_time;
        }

        // remaining time
        p.remaining_time -= cpu_time_needed;

        // CPU end time
        p.completion_time = this.current_cpu_time + cpu_time_needed;

        // turnaround time
        p.turnaround_time = p.completion_time - p.arrival_time;


        // update status
        if(p.remaining_time === 0){
            p.status = 'terminated';
            this.terminated_count++;
        }else{
            p.status = 'ready';
        }
        status_history += ` > ${p.status}`;

        // save to schedule history
        this.queue.push({
            name: p.name,
            status: status_history,
            cpu_start: this.current_cpu_time,
            cpu_end: p.completion_time,
            AT: p.arrival_time,
            RT: p.response_time,
            BT: p.burst_time,
            WT: p.waiting_time,
            TAT: p.turnaround_time,
            process: p
        });

        // update schedule data
        this.current_cpu_time += cpu_time_needed;
        this.total_waiting_time += p.waiting_time;
        this.total_TAT += p.turnaround_time;
    }


    /**
     * First Come First Served (FCFS)
     * @param processes
     */
    fcfs(processes = this.processes){
        this.algorithm_name = 'First Come First Served (FCFS)';

        // check is sort need
        let prev_arrival_time = 0;
        let is_sort_needed = false;
        processes.forEach(p => {
            if(prev_arrival_time !== p.arrival_time){
                is_sort_needed = true;
            }
            prev_arrival_time = p.arrival_time;
        });

        // sort by queue time
        processes = is_sort_needed ? sortArrayByObjectValue(processes, 'arrival_time') : processes;

        // exe
        processes.forEach(p => this.processControl(p));
    }


    /**
     * Shortest-Job-First (SJF)
     * @param processes
     */
    sjf(processes = this.processes){
        this.algorithm_name = 'Shortest-Job-First (SJF)';

        // keep looping until all processes are terminated

        while(this.terminated_count < this.processes.length){

            // find the process using the "s" function
            const p = this.s(processes)
            if(p) this.processControl(p);
        }
    }


    /**
     * Round Robin
     * @param processes
     */
    rr(processes = this.processes){
        this.algorithm_name = 'Round Robin (RR)';

        // process by quantum time
        while(this.terminated_count < this.processes.length){
            processes.forEach(p => this.processControl(p));
        }
    }
}