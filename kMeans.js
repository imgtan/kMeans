import * as mtrx from '../../math/matrix/Matrix';
import euclideanDistance from '../../math/euclidean-distance/euclideanDistance';

/*
*   @param {num[][]} as data - array of dataSet points, i.e. [[0,0], [1,3], [9,7]]
*   @param {num} as k - num of clusters
*   @param {num[]} - the class of the point
*/

export default function KMeans(data,k=1) 
{
    //first: if data is empty gives error message
    if (!data) { 
        throw new Error('The data is empty');
    }

    //assign k clusters locations equal to the location of initial k points.
    const dataDim = data[0].length;
    const clusterCenters = data.slice(0,k);

  // Continue optimization till convergence.
  // Centroids should not be moving once optimized.
  // Calculate distance of each candidate vector from each cluster center.
  // Assign cluster number to each data vector according to minimum distance.

  // Matrix of distance from each data point to each cluster centroid.
    const distance = mtrx.zeros([data.length, k]);

  // Vector data points' classes. The value of -1 means that no class has bee assigned yet.
    const classes = Array(data.length).fill(-1);

    let iterate = true;
    while(iterate) {
        iterate = false;

        //Calculate and store the distance of each data point from each cluster.
        for(let dataIndex = 0; dataIndex < data.length; dataIndex += 1) {
            for(let clusterIndex = 0; clusterIndex < k; clusterIndex += 1) {
                distance[dataIndex][clusterIndex] = euclideanDistance([clusterCenters[clusterIndex]], [data[dataIndex]]);
            }
        }

        //assign the closest cluster number to each dataSet point.
        const closestClusterIdx = distance[dataIndex].indexOf(Math.min(...distance[dataIndex]));

        if(classes[dataIndex]!== closestClusterIdx){
            iterate = true;
        }

        classes[dataIndex] = closestClusterIdx;    
    }

    //Recalculate cluster centroid values via all dimentions of the points under it
    for(let clusterIndex = 0; clusterIndex < k; clusterIndex += 1) {
        //Reset cluster center coordinates since we need to recalculate them.
        clusterCenters[clusterIndex] = Array(dataDim).fill(0);
        let clusterSize = 0;
        for(let dataIndex = 0; dataIndex < data.length; dataIndex += 1) {
            if (classes[dataIndex] === clusterIndex) {
                //Register one more data point of current cluster.
                clusterSize += 1;
                for(let dimentionIndex = 0; dimentionIndex < dataDim; dimentionIndex += 1){
                    //Add data point coordinates to the cluster center coordinates.
                    clusterCenters[clusterIndex][dimentionIndex] += data[dataIndex][dimentionIndex];
                }
            }
            for(let dimentionIndex = 0; dimentionIndex < dataDim; dimentionIndex += 1) {
            clusterCenters[clusterIndex][dimentionIndex] = parseFloat(Number(clusterCenters[clusterIndex][dimentionIndex]/clusterSize).toFixed(2));
            }
        } 
    }
    
    return classes;
}

