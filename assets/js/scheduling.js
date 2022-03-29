class Scheduling{
    constructor(options){
        this.loop_step = 1;
        this.loop_count = 0;
        this.loop_max = 20;

        this.quantum_time = options.quantum_time || 1;
        this.processes = options.processes || []; // list of processes

        // check process's names if empty
        this.processes.forEach((p, i) => {
            p.name = p.name.length ? p.name : `P${i + 1}`;
            //p.queue_time = p.queue_time ? p.queue_time : i;
        });
        //this.processes = sortArrayByObjectValue(this.processes, 'queue_time');

        console.log('List of processes:')
        console.table(this.processes)

        // FCFS, SJF, RR
        this.algorithm = options.algorithm || 'FCFS';

        // run algorithm
        this.terminated_count = 0;
        this.queue = [];
        this.current_cpu_time = 0;
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

        console.table(this.queue);
        console.log('Total CPU time:', this.current_cpu_time);
        console.log('Total waiting time:', this.total_waiting_time);
        console.log('Average waiting time:', this.awt());
        console.log('Throughput:', this.throughput());

        console.log('Done! <---------')
        console.log('')
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
        const ready_processes = processes.filter(p => p.status === 'ready');
        if(ready_processes.length === 1) return ready_processes[0];

        // get min burst time
        const min_burst_time = Math.min(...ready_processes.map(p => p.burst_time));
        const min_processes = ready_processes.filter(p => p.burst_time === min_burst_time);
        if(min_processes.length === 1) return min_processes[0];

        // get the min process that comes first
        const sorted_min_processes = sortArrayByObjectValue(min_processes, 'queue_time');
        return sorted_min_processes[0];
    }


    /**
     * Process Control Block
     * @param p
     */
    processControl(p){
        // run this process
        p.status = 'running';

        const cpu_time_needed = Math.min(p.remaining_time, p.burst_time);
        p.waiting_time = this.current_cpu_time - p.queue_time;
        p.remaining_time -= cpu_time_needed;

        if(p.remaining_time === 0){
            p.status = 'terminated';
            this.terminated_count++;
        }

        // save to schedule history
        this.queue.push({
            name: p.name,
            //waiting_time: p.waiting_time,
            cpu_start: this.current_cpu_time,
            cpu_end: this.current_cpu_time + cpu_time_needed,
            //status: p.status,
            process: p
        });

        // update schedule data
        this.current_cpu_time += cpu_time_needed;
        this.total_waiting_time += p.waiting_time;
    }


    /**
     * First Come First Served (FCFS)
     * @param processes
     */
    fcfs(processes = this.processes){
        this.algorithm_name = 'First Come First Served (FCFS)';

        // check is sort need
        let prev_queue_time = 0;
        let is_sort_needed = false;
        processes.forEach(p => {
            if(prev_queue_time !== p.queue_time){
                is_sort_needed = true;
            }
            prev_queue_time = p.queue_time;
        });

        // sort by queue time
        processes = is_sort_needed ? sortArrayByObjectValue(processes, 'queue_time') : processes;

        // exe
        processes.forEach(p => {
            this.processControl(p);
        })
    }


    /**
     * Shortest-Job-First (SJF)
     * @param processes
     */
    sjf(processes = this.processes){
        this.algorithm_name = 'Shortest-Job-First (SJF)';

        // keep looping until all processes are terminated
        for(let i = this.loop_count; i += this.loop_step; i < this.loop_max){
            // check new processes if they are ready for cpu burst
            processes.forEach(p => {
                // READY
                if(p.queue_time <= this.current_cpu_time && p.status === 'new'){
                    p.status = 'ready';
                }
            });

            // find the process using the "s" function
            const p = this.s(processes)

            if(p){
                this.processControl(p);
            }


            // ----------------------------------
            // avoid starvation
            this.loop_count += this.loop_step;
            if(this.loop_count >= this.loop_max) this.is_finished = true;

            if(this.terminated_count === this.processes.length) this.is_finished = true;

            // finish scheduling
            if(this.is_finished) break;
        }
    }


    /**
     * Round Robin
     * @param processes
     */
    rr(processes = this.processes){
        this.algorithm_name = 'Round Robin (RR)';

        // process by quantum time
        let is_finished = processes.filter(p => p.status !== 'terminated').length;
        while(is_finished > 0){
            processes.forEach((p, i) => {
                if(p.status === 'terminated') return;

                const cpu_time_needed = Math.min(p.remaining_time, this.quantum_time);
                p.status = 'running';
                p.waiting_time += this.current_cpu_time;
                p.remaining_time -= cpu_time_needed;

                if(p.remaining_time === 0 && p.status !== 'terminated'){
                    p.status = 'terminated';
                    is_finished--;
                }

                // save to schedule history
                this.queue.push({
                    process: p.name,
                    waiting_time: p.waiting_time,
                    cpu_start: this.current_cpu_time,
                    cpu_end: this.current_cpu_time + cpu_time_needed,
                    status: p.status
                });

                // update schedule data
                this.current_cpu_time += cpu_time_needed;
                this.total_waiting_time += p.waiting_time;
            });
        }
    }
}