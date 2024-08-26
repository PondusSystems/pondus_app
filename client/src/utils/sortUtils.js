const sortArray = (arr, key, direction) => {
    return arr.sort((a, b) => {
        if (a[key] < b[key]) {
            return direction === 'asc' ? -1 : 1;
        }
        if (a[key] > b[key]) {
            return direction === 'asc' ? 1 : -1;
        }
        return 0;
    });
};

export {
    sortArray,
};