const PodCollectionRepository = require('../lib/PodCollectionRepository');

const podCollection = new PodCollectionRepository();

test('Adding Pod(ID:1001-1) to podCollection by addPod()', () => {
    expect(podCollection.addPod("1001-1")).toBe(1);
});

test('Adding Pod(ID:1001-2) to podCollection by addPod()', () => {
  expect(podCollection.addPod("1001-2")).toBe(2);
});

test('Error by Adding Unknown Pod(ID:0000-0) to podCollection', () => {
  expect(() => { podCollection.addPod("0000-0") }).toThrowError('This is unknown Pod!');
});

test('Searching Pod(ID:1001-1) by getPod()', () => {
  expect(podCollection.getPod("1001", 2))
    .toEqual({
      manifest: "1001",
      id: "2",
      num: 2,
      name: "LED",
      port:{
        "1" : {
          "name": "Red",
          "data": 0
        },
        "2" : {
          "name": "Green",
          "data": 0
        },
        "3" : {
          "name": "Blue",
          "data": 0
        }
      }
    });
});

test('Updating Pod(ID:1001-1) by updatePod()', () => {
  expect(podCollection.updatePod("1001", 1, {"port": 1, "data": 200}))
    .toEqual({
      manifest: "1001",
      id: "1",
      num: 1,
      name: "LED",
      port:{
        "1" : {
          "name": "Red",
          "data": 200
        },
        "2" : {
          "name": "Green",
          "data": 0
        },
        "3" : {
          "name": "Blue",
          "data": 0
        }
      }
    });
});

test('Detete All Pod', () => {
  expect(podCollection.deletePods()).toBe(true);
});