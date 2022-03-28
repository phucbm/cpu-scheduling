/**
 * Sort array of object by value
 * @param array
 * @param key
 * @param asc
 * @returns {*[]}
 */
function sortArrayByObjectValue(array, key, asc = true){
    const newArray = [...array];
    if(asc){
        newArray.sort((a, b) => a[key] > b[key] && 1 || -1);
    }else{
        newArray.sort((a, b) => a[key] < b[key] && 1 || -1);
    }

    return newArray;
}