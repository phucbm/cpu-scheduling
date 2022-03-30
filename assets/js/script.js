console.clear();

// Lesson02/p28
const lesson02p28 = {
    algorithm: 'FCFS',
    processes: [
        new Process({burst_time: 24}),
        new Process({burst_time: 3}),
        new Process({burst_time: 3}),
    ]
};

// Lesson02/p33
const lesson02p33 = {
    algorithm: 'SJF',
    processes: [
        new Process({arrival_time: 0, burst_time: 7}),
        new Process({arrival_time: 2, burst_time: 4}),
        new Process({arrival_time: 4, burst_time: 1}),
        new Process({arrival_time: 5, burst_time: 4}),
    ]
};

/**
 * Run
 */
const inputData = [lesson02p33, lesson02p28];
// inputData.forEach(input => {
//     new Scheduling(input);
// });


/**
 * Bai tap: Cau 1
 */
const cau1 = [
    new Process({arrival_time: 0, burst_time: 10}),
    new Process({arrival_time: 2, burst_time: 1}),
    new Process({arrival_time: 3, burst_time: 5}),
    new Process({arrival_time: 1, burst_time: 1}),
    new Process({arrival_time: 4, burst_time: 5}),
];
const solveCau1 = processes => {
    // FCFS
    new Scheduling({
        algorithm: 'FCFS',
        processes: JSON.parse(JSON.stringify(processes))
    });

    // SJF
    new Scheduling({
        algorithm: 'SJF',
        processes: JSON.parse(JSON.stringify(processes))
    });

    // RR
    new Scheduling({
        algorithm: 'RR',
        quantum_time: 2,
        processes: JSON.parse(JSON.stringify(processes))
    });
};


/**
 * Bai tap: Cau 2
 */
const cau2 = [
    new Process({burst_time: 10, io_arrival_time: 0, io_time: 3}),
    new Process({burst_time: 4, io_arrival_time: 2, io_time: 1}),
    new Process({burst_time: 5, io_arrival_time: 3, io_time: 3}),
    new Process({burst_time: 3, io_arrival_time: 2, io_time: 1}),
    new Process({burst_time: 5, io_arrival_time: 4, io_time: 2}),
];
const solve2 = processes => {
    // FCFS
    new Scheduling({
        algorithm: 'FCFS',
        has_io: true,
        processes: JSON.parse(JSON.stringify(processes))
    });

    // SJF
    new Scheduling({
        algorithm: 'SJF',
        processes: JSON.parse(JSON.stringify(processes))
    });

    // RR
    new Scheduling({
        algorithm: 'RR',
        quantum_time: 2,
        has_io: true,
        processes: JSON.parse(JSON.stringify(processes))
    });
};
//solve2(cau2);


/**
 * Demo RR I/O
 */
// RR
new Scheduling({
    algorithm: 'RR',
    quantum_time: 2,
    has_io: true,
    processes: [
        new Process({name: 'A', burst_time: 10, io_arrival_time: 2, io_time: 2}),
        new Process({name: 'B', burst_time: 9, io_arrival_time: 3, io_time: 2}),
    ]
});