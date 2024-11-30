import { asyncLoadImage, randomImageData } from '../utils/testingUtils';
import neuralNetwork from './index';

describe('Adding data to Neural Network', () => {
  let nn;

  const lastData = () =>
    nn.neuralNetworkData.data.raw[nn.neuralNetworkData.data.raw.length - 1];

  const warnSpy = jest.spyOn(console, 'warn');

  describe('classification', () => {
    describe('using property names for inputs and outputs', () => {
      beforeAll(async () => {
        return new Promise((resolve) => {
          nn = neuralNetwork({
            inputs: ['avg_temperature', 'humidity'],
            outputs: ['rained'],
            task: 'classification'
          }, () => resolve());
        });
      });

      it('creates a model', () => {
        expect(nn.options.inputs).toHaveLength(2);
        expect(nn.options.outputs).toHaveLength(1);
        expect(nn.options.outputs[0]).toBe('rained');
      });

      it('can add data from a dictionary object', () => {
        nn.addData({ "avg_temperature": 20, "humidity": 0.2 }, { "rained": "no" });
        const added = lastData();
        expect(added.xs.avg_temperature).toBe(20);
        expect(added.xs.humidity).toBe(0.2);
        expect(added.ys.rained).toBe('no');
      });

      // Currently fails
      it.skip('ignores excess properties', () => {
        // TODO: why do xs and ys need to be passed separately in this case?
        const row = { "avg_temperature": 30, "humidity": 0.9, "rained": "yes" };
        nn.addData(row, row);
        const added = lastData();
        expect(added.xs.humidity).toBe(0.9);
        expect(added.xs.rained).toBeUndefined();
        expect(added.ys.rained).toBe('yes');
        expect(added.ys.humidity).toBeUndefined();
      });

      // Currently fails
      it.skip('errors on missing properties', () => {
        expect(() => {
          nn.addData({}, { "rained": "yes" });
        }).toThrow(); // TODO: check for a friendly message
      });

      it('can add data as an array', () => {
        nn.addData([25, 0.3], ["no"]);
        const added = lastData();
        expect(added.xs.avg_temperature).toBe(25);
        expect(added.xs.humidity).toBe(0.3);
        expect(added.ys.rained).toBe('no');
      });

      // Currently fails
      it.skip('errors on too few inputs', () => {
        expect(() => {
          nn.addData([25], ["no"]);
        }).toThrow(); // TODO: check for a friendly message
      });

      // Currently fails
      it.skip('warns on too many inputs', () => {
        expect(() => {
          nn.addData([1, 2, 3, 4, 5], ["no"]);
        }).not.toThrow();
        expect(warnSpy).toHaveBeenCalled();
      });
    });

    describe('using numbers for inputs and outputs', () => {
      beforeEach(async () => {
        return new Promise((resolve) => {
          nn = neuralNetwork({
            inputs: 2,
            outputs: 2,
            task: 'classification'
          }, () => resolve());
        });
      });

      it('creates a model', () => {
        expect(nn.options.inputs).toBe(2);
        expect(nn.options.outputs).toBe(2);
      });

      it('can add data from a dictionary object', async () => {
        nn.addData({ "avg_temperature": 25, "humidity": 0.3 }, { "rained": "no" });
        const added = lastData();
        expect(added.xs.avg_temperature).toBe(25);
        expect(added.xs.humidity).toBe(0.3);
        expect(added.ys.rained).toBe('no');
        nn.addData({ "avg_temperature": 30, "humidity": 0.9 },{ "rained": "yes" });
        await nn.train();
        const guess = await nn.classify({ "avg_temperature": 20, "humidity": 0.4 });
        expect(guess[0].label).toBe('no');
        expect(guess[1].label).toBe('yes');
      });

      it('can add data as an array', async () => {
        nn.addData([25, 0.3], ["no"]);
        const added = lastData();
        expect(added.xs['0']).toBe(25);
        expect(added.xs['1']).toBe(0.3);
        expect(added.ys['0']).toBe('no');
        nn.addData([30, 0.9], ["yes"]);
        await nn.train();
        const guess = await nn.classify([20, 0.4]);
        expect(guess[0].label).toBe('no');
        expect(guess[1].label).toBe('yes');
      });
    });
  });

  // All currently fail
  describe.skip('image classification', () => {
    beforeAll(async () => {
      nn = neuralNetwork({
        task: 'imageClassification',
        inputs: [32, 32, 3],
        // outputs: ['label']
        outputs: 2
        // outputs: ['cat', 'dog']
      });
      await nn.ready;
    });

    it('can add HTML images', () => {
      const dataSpy = jest.spyOn(nn.neuralNetworkData, 'addData');
      const image = asyncLoadImage('https://cdn.jsdelivr.net/gh/ml5js/ml5-library@main/assets/bird.jpg');
      nn.addData({ image: image }, { label: 'cat' });
      expect(dataSpy).toHaveBeenCalledTimes(1);
      expect(lastData().xs.image.length).toBe(32 * 32 * 3);
      // TODO
    });

    it('can add untyped pixel arrays', () => {
      nn.addData({ image: new Array(32 * 32 * 3).fill(0) }, { label: 'cat' });
      nn.addData(new Array(32 * 32 * 3).fill(0), 'cat');
      // TODO
    });

    it('can add typed pixel arrays', () => {
      const imageData = randomImageData(32, 32);
      nn.addData({ image: imageData.data }, { label: 'cat' });
      nn.addData(imageData.data, 'cat');
      // TODO
    });
  });
});
