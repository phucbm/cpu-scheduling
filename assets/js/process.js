class Process{
    constructor(options){
        this.name = options.name || ''; // process name

        this.burst_time = options.burst_time || 0; // CPU time

        this.arrival_time = options.arrival_time || 0; // time to start using CPU

        this.io_arrival_time = options.io_arrival_time || 0;
        this.io_time = options.io_time || 0;
        this.io_start = -1;
        this.io_end = 9999999;

        // 1: new
        // 2: ready (for CPU burst)
        // 3: running
        // 4: waiting (or blocked, waiting for I/O
        // 5: terminated
        this.status = 'new'; // also known as process context

        //this.pid = ''; // process identifier

        // preemptive, non-preemptive
        //this.decision_mode = 'non-preemptive';

        this.cpu_time = 0;
        this.completion_time = 0;
        this.waiting_time = 0;
        this.remaining_time = this.burst_time;
        this.response_time = 0;
        this.turnaround_time = 0;
        this.run_time = 0;
    }
}