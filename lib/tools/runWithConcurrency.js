const runWithConcurrency = (concurrency, tasks) => {
    return new Promise((resolve, reject) => {
        const results = [];
        let rejected = false;
        let settled = tasks.length;
        const forRun = [...tasks];
        const run = () => {
            const index = tasks.length - forRun.length;
            const next = forRun.shift();
            if (next) {
                next()
                    .then((result) => {
                    if (rejected)
                        return;
                    results[index] = result;
                    settled -= 1;
                    if (settled) {
                        run();
                    }
                    else {
                        resolve(results);
                    }
                })
                    .catch(error => {
                    rejected = true;
                    reject(error);
                });
            }
        };
        for (let i = 0; i < concurrency; i++) {
            run();
        }
    });
};
export default runWithConcurrency;
