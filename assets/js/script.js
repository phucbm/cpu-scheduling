console.clear();

// Question 1
// const cpu_scheduling = new Scheduling({
//     algorithm: 'SJF',
//     processes: [
//         new Process({queue_time: 0, burst_time: 10}),
//         new Process({queue_time: 2, burst_time: 1}),
//         new Process({queue_time: 3, burst_time: 5}),
//         new Process({queue_time: 1, burst_time: 1}),
//         new Process({queue_time: 4, burst_time: 5}),
//     ]
// });

// Lesson02/p28
new Scheduling({
    algorithm: 'FCFS',
    processes: [
        new Process({burst_time: 24}),
        new Process({burst_time: 3}),
        new Process({burst_time: 3}),
    ]
});

// Lesson02/p33
new Scheduling({
    algorithm: 'SJF',
    processes: [
        new Process({queue_time: 0, burst_time: 7}),
        new Process({queue_time: 2, burst_time: 4}),
        new Process({queue_time: 4, burst_time: 1}),
        new Process({queue_time: 5, burst_time: 4}),
    ]
});

// const cpu_scheduling2 = new Scheduling({
//     algorithm: 'RR',
//     quantum_time: 20,
//     processes: [
//         new Process({burst_time: 53}),
//         new Process({burst_time: 17}),
//         new Process({burst_time: 68}),
//         new Process({burst_time: 24}),
//     ]
// });