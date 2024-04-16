const boxContainer = document.getElementById("barContainer");

function generateBars(numBars) {
    const array = [];
    const boxElements = [];

    // Clear previous bars
    boxContainer.innerHTML = "";

    // Generate random numbers and create bar elements
    for (let i = 0; i < numBars; i++) {
        const randomNumber = Math.floor(Math.random() * 100) + 1; // Random number between 1 and 325
        array.push(randomNumber);

        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${randomNumber * 5}px`; // Adjust height of bars (multiplied by 5 for larger bars)
        boxElements.push(bar);
        boxContainer.appendChild(bar);
    }

    return { array, boxElements };
}

async function animateSort(sortFunction, numBars) {
    const { array, boxElements } = generateBars(numBars);

    // Call sort function
    await sortFunction(array, boxElements);
}

async function animateBubbleSort(array, boxElements) {
    // Bubble sort logic
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            // Highlight the bars being compared
            boxElements[j].style.backgroundColor = "red";
            boxElements[j + 1].style.backgroundColor = "red";
            await new Promise(resolve => setTimeout(resolve, 325)); // Delay for visualization

            if (array[j] > array[j + 1]) {
                // Swap array elements
                [array[j], array[j + 1]] = [array[j + 1], array[j]];

                // Swap bar heights visually
                [boxElements[j].style.height, boxElements[j + 1].style.height] =
                    [boxElements[j + 1].style.height, boxElements[j].style.height];
            }

            // Reset bar colors
            boxElements[j].style.backgroundColor = "";
            boxElements[j + 1].style.backgroundColor = "";
        }
    }
}

async function animateMergeSort(array, boxElements) {
    // Merge sort logic
    async function mergeSort(start, end) {
        if (start < end) {
            const mid = Math.floor((start + end) / 2);
            await mergeSort(start, mid);
            await mergeSort(mid + 1, end);
            await merge(start, mid, end);
        }
    }

    async function merge(start, mid, end) {
        const tempArray = new Array(end - start + 1);
        let i = start;
        let j = mid + 1;
        let k = 0;

        // Merge the two halves into the tempArray
        while (i <= mid && j <= end) {
            if (array[i] <= array[j]) {
                tempArray[k++] = array[i++];
            } else {
                tempArray[k++] = array[j++];
            }
        }

        // Copy the remaining elements from the first half, if any
        while (i <= mid) {
            tempArray[k++] = array[i++];
        }

        // Copy the remaining elements from the second half, if any
        while (j <= end) {
            tempArray[k++] = array[j++];
        }

        // Copy the sorted elements from tempArray back to the original array
        for (let l = 0; l < tempArray.length; l++) {
            array[start + l] = tempArray[l];
        }

        // Animate the sorting process
        for (let m = start; m <= end; m++) {
            await new Promise(resolve => setTimeout(resolve, 325));
            boxElements[m].style.height = `${array[m] * 5}px`; // Update bar height (multiplied by 5 for larger bars)
            boxElements[m].style.backgroundColor = "green"; // Set bar color to red
        }
    }

    // Call merge sort function
    await mergeSort(0, array.length - 1);
}

async function animateQuickSort(array, boxElements) {
    // Quick sort logic
    async function quickSort(start, end) {
        if (start >= end) return;

        let index = await partition(start, end);
        await quickSort(start, index - 1);
        await quickSort(index + 1, end);
    }

    async function partition(start, end) {
        let pivot = array[end];
        let i = start - 1;

        for (let j = start; j < end; j++) {
            // Highlight the bars being compared
            boxElements[j].style.backgroundColor = "#007cb9";
            boxElements[end].style.backgroundColor = "blue";
            await new Promise(resolve => setTimeout(resolve, 325));

            if (array[j] < pivot) {
                i++;
                [array[i], array[j]] = [array[j], array[i]];
                [boxElements[i].style.height, boxElements[j].style.height] =
                    [boxElements[j].style.height, boxElements[i].style.height];
                await new Promise(resolve => setTimeout(resolve, 325));
            }

            // Reset bar colors
            boxElements[j].style.backgroundColor = "";
            boxElements[end].style.backgroundColor = "";
        }

        [array[i + 1], array[end]] = [array[end], array[i + 1]];
        [boxElements[i + 1].style.height, boxElements[end].style.height] =
            [boxElements[end].style.height, boxElements[i + 1].style.height];
        await new Promise(resolve => setTimeout(resolve, 325));

        return i + 1;
    }

    await quickSort(0, array.length - 1);
}

async function animateHeapSort(array, boxElements) {
    // Heap sort logic
    async function heapify(n, i) {
        let largest = i;
        let left = 2 * i + 1;
        let right = 2 * i + 2;

        // Highlight the bars being compared
        if (left < n) {
            boxElements[left].style.backgroundColor = "purple";
            await new Promise(resolve => setTimeout(resolve, 325));
            boxElements[left].style.backgroundColor = "";
        }
        if (right < n) {
            boxElements[right].style.backgroundColor = "purple";
            await new Promise(resolve => setTimeout(resolve, 325));
            boxElements[right].style.backgroundColor = "";
        }

        if (left < n && array[left] > array[largest]) {
            largest = left;
        }

        if (right < n && array[right] > array[largest]) {
            largest = right;
        }

        if (largest !== i) {
            // Swap array elements
            [array[i], array[largest]] = [array[largest], array[i]];

            // Swap bar heights visually
            [boxElements[i].style.height, boxElements[largest].style.height] =
                [boxElements[largest].style.height, boxElements[i].style.height];

            await heapify(n, largest);
        }
    }

    async function heapSort() {
        const n = array.length;

        // Build max heap
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            await heapify(n, i);
        }

        // Extract elements from heap one by one
        for (let i = n - 1; i > 0; i--) {
            // Highlight the bar being moved to its final position
            boxElements[0].style.backgroundColor = "purple";
            boxElements[i].style.backgroundColor = "purple";
            await new Promise(resolve => setTimeout(resolve, 325));

            // Swap array elements
            [array[0], array[i]] = [array[i], array[0]];

            // Swap bar heights visually
            [boxElements[0].style.height, boxElements[i].style.height] =
                [boxElements[i].style.height, boxElements[0].style.height];

            // Reset bar colors
            boxElements[0].style.backgroundColor = "";
            boxElements[i].style.backgroundColor = "";

            // Heapify the reduced heap
            await heapify(i, 0);
        }
    }

    await heapSort();
}


// Event listener to generate bars when the DOM content is loaded
window.addEventListener('DOMContentLoaded', () => {
    const numBars = 10; // Number of bars to generate
    generateBars(numBars);
});

// Event listeners for the sorting buttons
document.getElementById("animateBubbleSortBtn").addEventListener("click", async () => {
    const numBars = 10; // Number of bars to generate
    document.querySelector('.title').style.color = 'red'; // Change title color to red during sorting
    await animateSort(animateBubbleSort, numBars);
    document.querySelector('.title').style.color = 'white'; // Revert title color back to white
    
});

document.getElementById("animateQuickSortBtn").addEventListener("click", async () => {
    const numBars = 10; // Number of bars to generate
    document.querySelector('.title').style.color = 'blue'; // Change title color to blue during sorting
    await animateSort(animateQuickSort, numBars);
    document.querySelector('.title').style.color = 'white'; // Revert title color back to white
});

document.getElementById("animateMergeSortBtn").addEventListener("click", async () => {
    const numBars = 10; // Number of bars to generate
    document.querySelector('.title').style.color = 'green'; // Change title color to green during sorting
    await animateSort(animateMergeSort, numBars);
    document.querySelector('.title').style.color = 'white'; // Revert title color back to white
});

document.getElementById("animateHeapSortBtn").addEventListener("click", async () => {
    const numBars = 10; // Number of bars to generate
    document.querySelector('.title').style.color = 'purple'; // Change title color to purple during sorting
    await animateSort(animateHeapSort, numBars);
    document.querySelector('.title').style.color = 'white'; // Revert title color back to white
});













