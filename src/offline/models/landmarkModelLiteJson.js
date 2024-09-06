const modelJson = {
  format: "graph-model",
  generatedBy: "2.8.0",
  convertedBy: "TensorFlow.js Converter v3.7.0",
  signature: {
    inputs: {
      input_1: {
        name: "input_1:0",
        dtype: "DT_FLOAT",
        tensorShape: {
          dim: [
            { size: "-1" },
            { size: "224" },
            { size: "224" },
            { size: "3" },
          ],
        },
      },
    },
    outputs: {
      "Identity_1:0": {
        name: "Identity_1:0",
        dtype: "DT_FLOAT",
        tensorShape: { dim: [{ size: "-1" }, { size: "1" }] },
      },
      "Identity_3:0": {
        name: "Identity_3:0",
        dtype: "DT_FLOAT",
        tensorShape: { dim: [{ size: "-1" }, { size: "63" }] },
      },
      "Identity:0": {
        name: "Identity:0",
        dtype: "DT_FLOAT",
        tensorShape: { dim: [{ size: "-1" }, { size: "1" }] },
      },
      "Identity_2:0": {
        name: "Identity_2:0",
        dtype: "DT_FLOAT",
        tensorShape: { dim: [{ size: "-1" }, { size: "63" }] },
      },
    },
  },
  modelTopology: {
    node: [
      {
        name: "StatefulPartitionedCall/model/conv_handedness/MatMul/ReadVariableOp",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "672" }, { size: "1" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv_handedness/BiasAdd/ReadVariableOp",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "1" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv_handflag/MatMul/ReadVariableOp",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "672" }, { size: "1" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv_handflag/BiasAdd/ReadVariableOp",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "1" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv_landmarks/MatMul/ReadVariableOp",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "672" }, { size: "63" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv_landmarks/BiasAdd/ReadVariableOp",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "63" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/global_average_pooling2d/Mean/reduction_indices",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_INT32",
              tensorShape: { dim: [{ size: "2" }] },
            },
          },
          dtype: { type: "DT_INT32" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv_world_landmarks/MatMul/ReadVariableOp",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "672" }, { size: "63" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv_world_landmarks/BiasAdd/ReadVariableOp",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "63" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "input_1",
        op: "Placeholder",
        attr: {
          shape: {
            shape: {
              dim: [
                { size: "-1" },
                { size: "224" },
                { size: "224" },
                { size: "3" },
              ],
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d/Conv2D_weights",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "3" },
                  { size: "3" },
                  { size: "3" },
                  { size: "24" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d/Conv2D_bn_offset",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "24" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_13/depthwise_weights",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "5" },
                  { size: "5" },
                  { size: "672" },
                  { size: "1" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d/depthwise_weights",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "3" },
                  { size: "3" },
                  { size: "24" },
                  { size: "1" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d/depthwise_bn_offset",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "24" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_1/Conv2D_weights",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "24" },
                  { size: "16" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_1/Conv2D_bn_offset",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "16" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_2/Conv2D_weights",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "16" },
                  { size: "64" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_13/depthwise_bn_offset",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "672" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_2/Conv2D_bn_offset",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "64" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_1/depthwise_weights",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "3" },
                  { size: "3" },
                  { size: "64" },
                  { size: "1" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_1/depthwise_bn_offset",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "64" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_3/Conv2D_weights",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "64" },
                  { size: "16" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_3/Conv2D_bn_offset",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "16" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_4/Conv2D_weights",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "16" },
                  { size: "96" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_27/Conv2D_weights",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "672" },
                  { size: "112" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_4/Conv2D_bn_offset",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "96" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_2/depthwise_weights",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "3" },
                  { size: "3" },
                  { size: "96" },
                  { size: "1" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_2/depthwise_bn_offset",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "96" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_5/Conv2D_weights",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "96" },
                  { size: "16" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_27/Conv2D_bn_offset",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "112" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_5/Conv2D_bn_offset",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "16" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_6/Conv2D_weights",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "16" },
                  { size: "96" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_6/Conv2D_bn_offset",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "96" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_3/depthwise_weights",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "5" },
                  { size: "5" },
                  { size: "96" },
                  { size: "1" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_3/depthwise_bn_offset",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "96" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_7/Conv2D_weights",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "96" },
                  { size: "24" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_28/Conv2D_weights",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "112" },
                  { size: "672" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_7/Conv2D_bn_offset",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "24" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_8/Conv2D_weights",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "24" },
                  { size: "144" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_8/Conv2D_bn_offset",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "144" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_28/Conv2D_bn_offset",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "672" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_4/depthwise_weights",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "5" },
                  { size: "5" },
                  { size: "144" },
                  { size: "1" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_4/depthwise_bn_offset",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "144" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_9/Conv2D_weights",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "144" },
                  { size: "24" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_9/Conv2D_bn_offset",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "24" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_10/Conv2D_weights",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "24" },
                  { size: "144" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_10/Conv2D_bn_offset",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "144" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_14/depthwise_weights",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "5" },
                  { size: "5" },
                  { size: "672" },
                  { size: "1" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_5/depthwise_weights",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "3" },
                  { size: "3" },
                  { size: "144" },
                  { size: "1" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_5/depthwise_bn_offset",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "144" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_11/Conv2D_weights",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "144" },
                  { size: "48" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_11/Conv2D_bn_offset",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "48" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_12/Conv2D_weights",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "48" },
                  { size: "288" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_14/depthwise_bn_offset",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "672" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_12/Conv2D_bn_offset",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "288" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_6/depthwise_weights",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "3" },
                  { size: "3" },
                  { size: "288" },
                  { size: "1" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_6/depthwise_bn_offset",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "288" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_13/Conv2D_weights",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "288" },
                  { size: "48" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_13/Conv2D_bn_offset",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "48" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_14/Conv2D_weights",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "48" },
                  { size: "288" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_29/Conv2D_weights",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "672" },
                  { size: "112" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_14/Conv2D_bn_offset",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "288" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_7/depthwise_weights",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "3" },
                  { size: "3" },
                  { size: "288" },
                  { size: "1" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_7/depthwise_bn_offset",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "288" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_15/Conv2D_weights",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "288" },
                  { size: "48" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_29/Conv2D_bn_offset",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "112" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_15/Conv2D_bn_offset",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "48" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_16/Conv2D_weights",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "48" },
                  { size: "288" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_16/Conv2D_bn_offset",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "288" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_8/depthwise_weights",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "5" },
                  { size: "5" },
                  { size: "288" },
                  { size: "1" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_8/depthwise_bn_offset",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "288" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_17/Conv2D_weights",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "288" },
                  { size: "64" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_30/Conv2D_weights",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "112" },
                  { size: "672" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_17/Conv2D_bn_offset",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "64" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_18/Conv2D_weights",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "64" },
                  { size: "384" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_18/Conv2D_bn_offset",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "384" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_30/Conv2D_bn_offset",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "672" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_9/depthwise_weights",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "5" },
                  { size: "5" },
                  { size: "384" },
                  { size: "1" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_9/depthwise_bn_offset",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "384" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_19/Conv2D_weights",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "384" },
                  { size: "64" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_19/Conv2D_bn_offset",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "64" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_20/Conv2D_weights",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "64" },
                  { size: "384" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_20/Conv2D_bn_offset",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "384" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_15/depthwise_weights",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "3" },
                  { size: "3" },
                  { size: "672" },
                  { size: "1" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_10/depthwise_weights",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "5" },
                  { size: "5" },
                  { size: "384" },
                  { size: "1" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_10/depthwise_bn_offset",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "384" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_21/Conv2D_weights",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "384" },
                  { size: "64" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_21/Conv2D_bn_offset",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "64" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_22/Conv2D_weights",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "64" },
                  { size: "384" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_15/depthwise_bn_offset",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "672" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_22/Conv2D_bn_offset",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "384" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_11/depthwise_weights",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "5" },
                  { size: "5" },
                  { size: "384" },
                  { size: "1" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_11/depthwise_bn_offset",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "384" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_23/Conv2D_weights",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "384" },
                  { size: "112" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_23/Conv2D_bn_offset",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "112" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_24/Conv2D_weights",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "112" },
                  { size: "672" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_24/Conv2D_bn_offset",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "672" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_12/depthwise_weights",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "5" },
                  { size: "5" },
                  { size: "672" },
                  { size: "1" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_12/depthwise_bn_offset",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "672" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_25/Conv2D_weights",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "672" },
                  { size: "112" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_25/Conv2D_bn_offset",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "112" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_26/Conv2D_weights",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "112" },
                  { size: "672" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_26/Conv2D_bn_offset",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "672" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/re_lu/Relu6",
        op: "_FusedConv2D",
        input: [
          "input_1",
          "StatefulPartitionedCall/model/conv2d/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          fused_ops: { list: { s: ["Qmlhc0FkZA==", "UmVsdTY="] } },
          data_format: { s: "TkhXQw==" },
          epsilon: { f: 0.0 },
          use_cudnn_on_gpu: { b: true },
          T: { type: "DT_FLOAT" },
          num_args: { i: "1" },
          strides: { list: { i: ["1", "2", "2", "1"] } },
          explicit_paddings: { list: {} },
          padding: { s: "U0FNRQ==" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d/depthwise",
        op: "FusedDepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/re_lu/Relu6",
          "StatefulPartitionedCall/model/depthwise_conv2d/depthwise_weights",
          "StatefulPartitionedCall/model/depthwise_conv2d/depthwise_bn_offset",
        ],
        attr: {
          explicit_paddings: { list: {} },
          padding: { s: "U0FNRQ==" },
          T: { type: "DT_FLOAT" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          num_args: { i: "1" },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          data_format: { s: "TkhXQw==" },
          fused_ops: { list: { s: ["Qmlhc0FkZA==", "UmVsdTY="] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_2/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d/depthwise",
          "StatefulPartitionedCall/model/conv2d_1/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_1/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          use_cudnn_on_gpu: { b: true },
          padding: { s: "U0FNRQ==" },
          T: { type: "DT_FLOAT" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          epsilon: { f: 0.0 },
          data_format: { s: "TkhXQw==" },
          explicit_paddings: { list: {} },
          num_args: { i: "1" },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/max_pooling2d/MaxPool",
        op: "MaxPool",
        input: [
          "StatefulPartitionedCall/model/batch_normalization_2/FusedBatchNormV3",
        ],
        attr: {
          explicit_paddings: { list: {} },
          T: { type: "DT_FLOAT" },
          padding: { s: "VkFMSUQ=" },
          strides: { list: { i: ["1", "2", "2", "1"] } },
          ksize: { list: { i: ["1", "2", "2", "1"] } },
          data_format: { s: "TkhXQw==" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/re_lu_2/Relu6",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/batch_normalization_2/FusedBatchNormV3",
          "StatefulPartitionedCall/model/conv2d_2/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_2/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          fused_ops: { list: { s: ["Qmlhc0FkZA==", "UmVsdTY="] } },
          data_format: { s: "TkhXQw==" },
          T: { type: "DT_FLOAT" },
          epsilon: { f: 0.0 },
          padding: { s: "U0FNRQ==" },
          explicit_paddings: { list: {} },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          use_cudnn_on_gpu: { b: true },
          num_args: { i: "1" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_1/depthwise",
        op: "FusedDepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/re_lu_2/Relu6",
          "StatefulPartitionedCall/model/depthwise_conv2d_1/depthwise_weights",
          "StatefulPartitionedCall/model/depthwise_conv2d_1/depthwise_bn_offset",
        ],
        attr: {
          num_args: { i: "1" },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          strides: { list: { i: ["1", "2", "2", "1"] } },
          fused_ops: { list: { s: ["Qmlhc0FkZA==", "UmVsdTY="] } },
          T: { type: "DT_FLOAT" },
          explicit_paddings: { list: {} },
          data_format: { s: "TkhXQw==" },
          padding: { s: "U0FNRQ==" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_5/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d_1/depthwise",
          "StatefulPartitionedCall/model/conv2d_3/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_3/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          data_format: { s: "TkhXQw==" },
          use_cudnn_on_gpu: { b: true },
          padding: { s: "U0FNRQ==" },
          explicit_paddings: { list: {} },
          T: { type: "DT_FLOAT" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          epsilon: { f: 0.0 },
          num_args: { i: "1" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/add/add",
        op: "AddV2",
        input: [
          "StatefulPartitionedCall/model/batch_normalization_5/FusedBatchNormV3",
          "StatefulPartitionedCall/model/max_pooling2d/MaxPool",
        ],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/re_lu_4/Relu6",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/add/add",
          "StatefulPartitionedCall/model/conv2d_4/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_4/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          padding: { s: "U0FNRQ==" },
          data_format: { s: "TkhXQw==" },
          use_cudnn_on_gpu: { b: true },
          fused_ops: { list: { s: ["Qmlhc0FkZA==", "UmVsdTY="] } },
          num_args: { i: "1" },
          epsilon: { f: 0.0 },
          T: { type: "DT_FLOAT" },
          explicit_paddings: { list: {} },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_2/depthwise",
        op: "FusedDepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/re_lu_4/Relu6",
          "StatefulPartitionedCall/model/depthwise_conv2d_2/depthwise_weights",
          "StatefulPartitionedCall/model/depthwise_conv2d_2/depthwise_bn_offset",
        ],
        attr: {
          data_format: { s: "TkhXQw==" },
          fused_ops: { list: { s: ["Qmlhc0FkZA==", "UmVsdTY="] } },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          explicit_paddings: { list: {} },
          T: { type: "DT_FLOAT" },
          num_args: { i: "1" },
          padding: { s: "U0FNRQ==" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_8/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d_2/depthwise",
          "StatefulPartitionedCall/model/conv2d_5/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_5/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          explicit_paddings: { list: {} },
          epsilon: { f: 0.0 },
          num_args: { i: "1" },
          data_format: { s: "TkhXQw==" },
          padding: { s: "U0FNRQ==" },
          T: { type: "DT_FLOAT" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          use_cudnn_on_gpu: { b: true },
        },
      },
      {
        name: "StatefulPartitionedCall/model/add_1/add",
        op: "AddV2",
        input: [
          "StatefulPartitionedCall/model/batch_normalization_8/FusedBatchNormV3",
          "StatefulPartitionedCall/model/add/add",
        ],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/re_lu_6/Relu6",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/add_1/add",
          "StatefulPartitionedCall/model/conv2d_6/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_6/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          T: { type: "DT_FLOAT" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          data_format: { s: "TkhXQw==" },
          fused_ops: { list: { s: ["Qmlhc0FkZA==", "UmVsdTY="] } },
          explicit_paddings: { list: {} },
          num_args: { i: "1" },
          use_cudnn_on_gpu: { b: true },
          padding: { s: "U0FNRQ==" },
          epsilon: { f: 0.0 },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_3/depthwise",
        op: "FusedDepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/re_lu_6/Relu6",
          "StatefulPartitionedCall/model/depthwise_conv2d_3/depthwise_weights",
          "StatefulPartitionedCall/model/depthwise_conv2d_3/depthwise_bn_offset",
        ],
        attr: {
          explicit_paddings: { list: {} },
          data_format: { s: "TkhXQw==" },
          T: { type: "DT_FLOAT" },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          num_args: { i: "1" },
          padding: { s: "U0FNRQ==" },
          strides: { list: { i: ["1", "2", "2", "1"] } },
          fused_ops: { list: { s: ["Qmlhc0FkZA==", "UmVsdTY="] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_11/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d_3/depthwise",
          "StatefulPartitionedCall/model/conv2d_7/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_7/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          num_args: { i: "1" },
          padding: { s: "U0FNRQ==" },
          use_cudnn_on_gpu: { b: true },
          explicit_paddings: { list: {} },
          epsilon: { f: 0.0 },
          T: { type: "DT_FLOAT" },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          data_format: { s: "TkhXQw==" },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/re_lu_8/Relu6",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/batch_normalization_11/FusedBatchNormV3",
          "StatefulPartitionedCall/model/conv2d_8/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_8/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          fused_ops: { list: { s: ["Qmlhc0FkZA==", "UmVsdTY="] } },
          epsilon: { f: 0.0 },
          padding: { s: "U0FNRQ==" },
          data_format: { s: "TkhXQw==" },
          use_cudnn_on_gpu: { b: true },
          explicit_paddings: { list: {} },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          num_args: { i: "1" },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          T: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_4/depthwise",
        op: "FusedDepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/re_lu_8/Relu6",
          "StatefulPartitionedCall/model/depthwise_conv2d_4/depthwise_weights",
          "StatefulPartitionedCall/model/depthwise_conv2d_4/depthwise_bn_offset",
        ],
        attr: {
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          data_format: { s: "TkhXQw==" },
          fused_ops: { list: { s: ["Qmlhc0FkZA==", "UmVsdTY="] } },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          T: { type: "DT_FLOAT" },
          explicit_paddings: { list: {} },
          num_args: { i: "1" },
          padding: { s: "U0FNRQ==" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_14/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d_4/depthwise",
          "StatefulPartitionedCall/model/conv2d_9/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_9/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          explicit_paddings: { list: {} },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          use_cudnn_on_gpu: { b: true },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          padding: { s: "U0FNRQ==" },
          num_args: { i: "1" },
          T: { type: "DT_FLOAT" },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          data_format: { s: "TkhXQw==" },
          epsilon: { f: 0.0 },
        },
      },
      {
        name: "StatefulPartitionedCall/model/add_2/add",
        op: "AddV2",
        input: [
          "StatefulPartitionedCall/model/batch_normalization_14/FusedBatchNormV3",
          "StatefulPartitionedCall/model/batch_normalization_11/FusedBatchNormV3",
        ],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/re_lu_10/Relu6",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/add_2/add",
          "StatefulPartitionedCall/model/conv2d_10/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_10/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          strides: { list: { i: ["1", "1", "1", "1"] } },
          data_format: { s: "TkhXQw==" },
          epsilon: { f: 0.0 },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          T: { type: "DT_FLOAT" },
          fused_ops: { list: { s: ["Qmlhc0FkZA==", "UmVsdTY="] } },
          use_cudnn_on_gpu: { b: true },
          explicit_paddings: { list: {} },
          num_args: { i: "1" },
          padding: { s: "U0FNRQ==" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_5/depthwise",
        op: "FusedDepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/re_lu_10/Relu6",
          "StatefulPartitionedCall/model/depthwise_conv2d_5/depthwise_weights",
          "StatefulPartitionedCall/model/depthwise_conv2d_5/depthwise_bn_offset",
        ],
        attr: {
          T: { type: "DT_FLOAT" },
          explicit_paddings: { list: {} },
          data_format: { s: "TkhXQw==" },
          padding: { s: "U0FNRQ==" },
          fused_ops: { list: { s: ["Qmlhc0FkZA==", "UmVsdTY="] } },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          strides: { list: { i: ["1", "2", "2", "1"] } },
          num_args: { i: "1" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_17/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d_5/depthwise",
          "StatefulPartitionedCall/model/conv2d_11/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_11/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          strides: { list: { i: ["1", "1", "1", "1"] } },
          use_cudnn_on_gpu: { b: true },
          epsilon: { f: 0.0 },
          padding: { s: "U0FNRQ==" },
          data_format: { s: "TkhXQw==" },
          T: { type: "DT_FLOAT" },
          explicit_paddings: { list: {} },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          num_args: { i: "1" },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/re_lu_12/Relu6",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/batch_normalization_17/FusedBatchNormV3",
          "StatefulPartitionedCall/model/conv2d_12/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_12/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          epsilon: { f: 0.0 },
          data_format: { s: "TkhXQw==" },
          use_cudnn_on_gpu: { b: true },
          num_args: { i: "1" },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          padding: { s: "U0FNRQ==" },
          T: { type: "DT_FLOAT" },
          fused_ops: { list: { s: ["Qmlhc0FkZA==", "UmVsdTY="] } },
          explicit_paddings: { list: {} },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_6/depthwise",
        op: "FusedDepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/re_lu_12/Relu6",
          "StatefulPartitionedCall/model/depthwise_conv2d_6/depthwise_weights",
          "StatefulPartitionedCall/model/depthwise_conv2d_6/depthwise_bn_offset",
        ],
        attr: {
          fused_ops: { list: { s: ["Qmlhc0FkZA==", "UmVsdTY="] } },
          explicit_paddings: { list: {} },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          T: { type: "DT_FLOAT" },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          data_format: { s: "TkhXQw==" },
          num_args: { i: "1" },
          padding: { s: "U0FNRQ==" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_20/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d_6/depthwise",
          "StatefulPartitionedCall/model/conv2d_13/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_13/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          explicit_paddings: { list: {} },
          data_format: { s: "TkhXQw==" },
          num_args: { i: "1" },
          use_cudnn_on_gpu: { b: true },
          T: { type: "DT_FLOAT" },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          epsilon: { f: 0.0 },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          padding: { s: "U0FNRQ==" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/add_3/add",
        op: "AddV2",
        input: [
          "StatefulPartitionedCall/model/batch_normalization_20/FusedBatchNormV3",
          "StatefulPartitionedCall/model/batch_normalization_17/FusedBatchNormV3",
        ],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/re_lu_14/Relu6",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/add_3/add",
          "StatefulPartitionedCall/model/conv2d_14/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_14/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          strides: { list: { i: ["1", "1", "1", "1"] } },
          T: { type: "DT_FLOAT" },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          use_cudnn_on_gpu: { b: true },
          epsilon: { f: 0.0 },
          num_args: { i: "1" },
          padding: { s: "U0FNRQ==" },
          fused_ops: { list: { s: ["Qmlhc0FkZA==", "UmVsdTY="] } },
          explicit_paddings: { list: {} },
          data_format: { s: "TkhXQw==" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_7/depthwise",
        op: "FusedDepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/re_lu_14/Relu6",
          "StatefulPartitionedCall/model/depthwise_conv2d_7/depthwise_weights",
          "StatefulPartitionedCall/model/depthwise_conv2d_7/depthwise_bn_offset",
        ],
        attr: {
          num_args: { i: "1" },
          data_format: { s: "TkhXQw==" },
          padding: { s: "U0FNRQ==" },
          fused_ops: { list: { s: ["Qmlhc0FkZA==", "UmVsdTY="] } },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          T: { type: "DT_FLOAT" },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          explicit_paddings: { list: {} },
        },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_23/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d_7/depthwise",
          "StatefulPartitionedCall/model/conv2d_15/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_15/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          epsilon: { f: 0.0 },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          num_args: { i: "1" },
          T: { type: "DT_FLOAT" },
          explicit_paddings: { list: {} },
          data_format: { s: "TkhXQw==" },
          use_cudnn_on_gpu: { b: true },
          padding: { s: "U0FNRQ==" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/add_4/add",
        op: "AddV2",
        input: [
          "StatefulPartitionedCall/model/batch_normalization_23/FusedBatchNormV3",
          "StatefulPartitionedCall/model/add_3/add",
        ],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/re_lu_16/Relu6",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/add_4/add",
          "StatefulPartitionedCall/model/conv2d_16/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_16/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          epsilon: { f: 0.0 },
          data_format: { s: "TkhXQw==" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          fused_ops: { list: { s: ["Qmlhc0FkZA==", "UmVsdTY="] } },
          use_cudnn_on_gpu: { b: true },
          explicit_paddings: { list: {} },
          num_args: { i: "1" },
          padding: { s: "U0FNRQ==" },
          T: { type: "DT_FLOAT" },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_8/depthwise",
        op: "FusedDepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/re_lu_16/Relu6",
          "StatefulPartitionedCall/model/depthwise_conv2d_8/depthwise_weights",
          "StatefulPartitionedCall/model/depthwise_conv2d_8/depthwise_bn_offset",
        ],
        attr: {
          num_args: { i: "1" },
          data_format: { s: "TkhXQw==" },
          padding: { s: "U0FNRQ==" },
          fused_ops: { list: { s: ["Qmlhc0FkZA==", "UmVsdTY="] } },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          T: { type: "DT_FLOAT" },
          explicit_paddings: { list: {} },
        },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_26/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d_8/depthwise",
          "StatefulPartitionedCall/model/conv2d_17/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_17/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          padding: { s: "U0FNRQ==" },
          explicit_paddings: { list: {} },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          T: { type: "DT_FLOAT" },
          data_format: { s: "TkhXQw==" },
          num_args: { i: "1" },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          epsilon: { f: 0.0 },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          use_cudnn_on_gpu: { b: true },
        },
      },
      {
        name: "StatefulPartitionedCall/model/re_lu_18/Relu6",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/batch_normalization_26/FusedBatchNormV3",
          "StatefulPartitionedCall/model/conv2d_18/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_18/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          explicit_paddings: { list: {} },
          use_cudnn_on_gpu: { b: true },
          epsilon: { f: 0.0 },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          data_format: { s: "TkhXQw==" },
          fused_ops: { list: { s: ["Qmlhc0FkZA==", "UmVsdTY="] } },
          padding: { s: "U0FNRQ==" },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          T: { type: "DT_FLOAT" },
          num_args: { i: "1" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_9/depthwise",
        op: "FusedDepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/re_lu_18/Relu6",
          "StatefulPartitionedCall/model/depthwise_conv2d_9/depthwise_weights",
          "StatefulPartitionedCall/model/depthwise_conv2d_9/depthwise_bn_offset",
        ],
        attr: {
          strides: { list: { i: ["1", "1", "1", "1"] } },
          num_args: { i: "1" },
          explicit_paddings: { list: {} },
          fused_ops: { list: { s: ["Qmlhc0FkZA==", "UmVsdTY="] } },
          padding: { s: "U0FNRQ==" },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          T: { type: "DT_FLOAT" },
          data_format: { s: "TkhXQw==" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_29/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d_9/depthwise",
          "StatefulPartitionedCall/model/conv2d_19/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_19/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          strides: { list: { i: ["1", "1", "1", "1"] } },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          data_format: { s: "TkhXQw==" },
          T: { type: "DT_FLOAT" },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          padding: { s: "U0FNRQ==" },
          num_args: { i: "1" },
          use_cudnn_on_gpu: { b: true },
          epsilon: { f: 0.0 },
          explicit_paddings: { list: {} },
        },
      },
      {
        name: "StatefulPartitionedCall/model/add_5/add",
        op: "AddV2",
        input: [
          "StatefulPartitionedCall/model/batch_normalization_29/FusedBatchNormV3",
          "StatefulPartitionedCall/model/batch_normalization_26/FusedBatchNormV3",
        ],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/re_lu_20/Relu6",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/add_5/add",
          "StatefulPartitionedCall/model/conv2d_20/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_20/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          use_cudnn_on_gpu: { b: true },
          padding: { s: "U0FNRQ==" },
          data_format: { s: "TkhXQw==" },
          explicit_paddings: { list: {} },
          T: { type: "DT_FLOAT" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          fused_ops: { list: { s: ["Qmlhc0FkZA==", "UmVsdTY="] } },
          num_args: { i: "1" },
          epsilon: { f: 0.0 },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_10/depthwise",
        op: "FusedDepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/re_lu_20/Relu6",
          "StatefulPartitionedCall/model/depthwise_conv2d_10/depthwise_weights",
          "StatefulPartitionedCall/model/depthwise_conv2d_10/depthwise_bn_offset",
        ],
        attr: {
          strides: { list: { i: ["1", "1", "1", "1"] } },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          explicit_paddings: { list: {} },
          fused_ops: { list: { s: ["Qmlhc0FkZA==", "UmVsdTY="] } },
          padding: { s: "U0FNRQ==" },
          data_format: { s: "TkhXQw==" },
          num_args: { i: "1" },
          T: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_32/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d_10/depthwise",
          "StatefulPartitionedCall/model/conv2d_21/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_21/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          num_args: { i: "1" },
          T: { type: "DT_FLOAT" },
          epsilon: { f: 0.0 },
          use_cudnn_on_gpu: { b: true },
          padding: { s: "U0FNRQ==" },
          data_format: { s: "TkhXQw==" },
          explicit_paddings: { list: {} },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          strides: { list: { i: ["1", "1", "1", "1"] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/add_6/add",
        op: "AddV2",
        input: [
          "StatefulPartitionedCall/model/batch_normalization_32/FusedBatchNormV3",
          "StatefulPartitionedCall/model/add_5/add",
        ],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/re_lu_22/Relu6",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/add_6/add",
          "StatefulPartitionedCall/model/conv2d_22/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_22/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          data_format: { s: "TkhXQw==" },
          num_args: { i: "1" },
          T: { type: "DT_FLOAT" },
          explicit_paddings: { list: {} },
          use_cudnn_on_gpu: { b: true },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          epsilon: { f: 0.0 },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          fused_ops: { list: { s: ["Qmlhc0FkZA==", "UmVsdTY="] } },
          padding: { s: "U0FNRQ==" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_11/depthwise",
        op: "FusedDepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/re_lu_22/Relu6",
          "StatefulPartitionedCall/model/depthwise_conv2d_11/depthwise_weights",
          "StatefulPartitionedCall/model/depthwise_conv2d_11/depthwise_bn_offset",
        ],
        attr: {
          num_args: { i: "1" },
          explicit_paddings: { list: {} },
          strides: { list: { i: ["1", "2", "2", "1"] } },
          T: { type: "DT_FLOAT" },
          fused_ops: { list: { s: ["Qmlhc0FkZA==", "UmVsdTY="] } },
          padding: { s: "U0FNRQ==" },
          data_format: { s: "TkhXQw==" },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_35/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d_11/depthwise",
          "StatefulPartitionedCall/model/conv2d_23/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_23/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          T: { type: "DT_FLOAT" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          padding: { s: "U0FNRQ==" },
          explicit_paddings: { list: {} },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          data_format: { s: "TkhXQw==" },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          num_args: { i: "1" },
          use_cudnn_on_gpu: { b: true },
          epsilon: { f: 0.0 },
        },
      },
      {
        name: "StatefulPartitionedCall/model/re_lu_24/Relu6",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/batch_normalization_35/FusedBatchNormV3",
          "StatefulPartitionedCall/model/conv2d_24/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_24/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          num_args: { i: "1" },
          data_format: { s: "TkhXQw==" },
          use_cudnn_on_gpu: { b: true },
          padding: { s: "U0FNRQ==" },
          T: { type: "DT_FLOAT" },
          fused_ops: { list: { s: ["Qmlhc0FkZA==", "UmVsdTY="] } },
          epsilon: { f: 0.0 },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          explicit_paddings: { list: {} },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_12/depthwise",
        op: "FusedDepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/re_lu_24/Relu6",
          "StatefulPartitionedCall/model/depthwise_conv2d_12/depthwise_weights",
          "StatefulPartitionedCall/model/depthwise_conv2d_12/depthwise_bn_offset",
        ],
        attr: {
          data_format: { s: "TkhXQw==" },
          padding: { s: "U0FNRQ==" },
          T: { type: "DT_FLOAT" },
          fused_ops: { list: { s: ["Qmlhc0FkZA==", "UmVsdTY="] } },
          explicit_paddings: { list: {} },
          num_args: { i: "1" },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          strides: { list: { i: ["1", "1", "1", "1"] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_38/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d_12/depthwise",
          "StatefulPartitionedCall/model/conv2d_25/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_25/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          epsilon: { f: 0.0 },
          num_args: { i: "1" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          use_cudnn_on_gpu: { b: true },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          T: { type: "DT_FLOAT" },
          data_format: { s: "TkhXQw==" },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          explicit_paddings: { list: {} },
          padding: { s: "U0FNRQ==" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/add_7/add",
        op: "AddV2",
        input: [
          "StatefulPartitionedCall/model/batch_normalization_38/FusedBatchNormV3",
          "StatefulPartitionedCall/model/batch_normalization_35/FusedBatchNormV3",
        ],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/re_lu_26/Relu6",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/add_7/add",
          "StatefulPartitionedCall/model/conv2d_26/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_26/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          use_cudnn_on_gpu: { b: true },
          num_args: { i: "1" },
          data_format: { s: "TkhXQw==" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          T: { type: "DT_FLOAT" },
          fused_ops: { list: { s: ["Qmlhc0FkZA==", "UmVsdTY="] } },
          explicit_paddings: { list: {} },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          epsilon: { f: 0.0 },
          padding: { s: "U0FNRQ==" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_13/depthwise",
        op: "FusedDepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/re_lu_26/Relu6",
          "StatefulPartitionedCall/model/depthwise_conv2d_13/depthwise_weights",
          "StatefulPartitionedCall/model/depthwise_conv2d_13/depthwise_bn_offset",
        ],
        attr: {
          explicit_paddings: { list: {} },
          T: { type: "DT_FLOAT" },
          padding: { s: "U0FNRQ==" },
          num_args: { i: "1" },
          fused_ops: { list: { s: ["Qmlhc0FkZA==", "UmVsdTY="] } },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          data_format: { s: "TkhXQw==" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_41/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d_13/depthwise",
          "StatefulPartitionedCall/model/conv2d_27/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_27/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          data_format: { s: "TkhXQw==" },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          num_args: { i: "1" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          use_cudnn_on_gpu: { b: true },
          epsilon: { f: 0.0 },
          explicit_paddings: { list: {} },
          padding: { s: "U0FNRQ==" },
          T: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/add_8/add",
        op: "AddV2",
        input: [
          "StatefulPartitionedCall/model/batch_normalization_41/FusedBatchNormV3",
          "StatefulPartitionedCall/model/add_7/add",
        ],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/re_lu_28/Relu6",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/add_8/add",
          "StatefulPartitionedCall/model/conv2d_28/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_28/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          epsilon: { f: 0.0 },
          num_args: { i: "1" },
          padding: { s: "U0FNRQ==" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          explicit_paddings: { list: {} },
          use_cudnn_on_gpu: { b: true },
          fused_ops: { list: { s: ["Qmlhc0FkZA==", "UmVsdTY="] } },
          data_format: { s: "TkhXQw==" },
          T: { type: "DT_FLOAT" },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_14/depthwise",
        op: "FusedDepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/re_lu_28/Relu6",
          "StatefulPartitionedCall/model/depthwise_conv2d_14/depthwise_weights",
          "StatefulPartitionedCall/model/depthwise_conv2d_14/depthwise_bn_offset",
        ],
        attr: {
          T: { type: "DT_FLOAT" },
          padding: { s: "U0FNRQ==" },
          data_format: { s: "TkhXQw==" },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          explicit_paddings: { list: {} },
          num_args: { i: "1" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          fused_ops: { list: { s: ["Qmlhc0FkZA==", "UmVsdTY="] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_44/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d_14/depthwise",
          "StatefulPartitionedCall/model/conv2d_29/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_29/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          epsilon: { f: 0.0 },
          use_cudnn_on_gpu: { b: true },
          explicit_paddings: { list: {} },
          padding: { s: "U0FNRQ==" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          data_format: { s: "TkhXQw==" },
          T: { type: "DT_FLOAT" },
          num_args: { i: "1" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/add_9/add",
        op: "AddV2",
        input: [
          "StatefulPartitionedCall/model/batch_normalization_44/FusedBatchNormV3",
          "StatefulPartitionedCall/model/add_8/add",
        ],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/re_lu_30/Relu6",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/add_9/add",
          "StatefulPartitionedCall/model/conv2d_30/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_30/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          use_cudnn_on_gpu: { b: true },
          T: { type: "DT_FLOAT" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          num_args: { i: "1" },
          epsilon: { f: 0.0 },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          fused_ops: { list: { s: ["Qmlhc0FkZA==", "UmVsdTY="] } },
          data_format: { s: "TkhXQw==" },
          padding: { s: "U0FNRQ==" },
          explicit_paddings: { list: {} },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_15/depthwise",
        op: "FusedDepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/re_lu_30/Relu6",
          "StatefulPartitionedCall/model/depthwise_conv2d_15/depthwise_weights",
          "StatefulPartitionedCall/model/depthwise_conv2d_15/depthwise_bn_offset",
        ],
        attr: {
          fused_ops: { list: { s: ["Qmlhc0FkZA==", "UmVsdTY="] } },
          data_format: { s: "TkhXQw==" },
          padding: { s: "U0FNRQ==" },
          T: { type: "DT_FLOAT" },
          num_args: { i: "1" },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          explicit_paddings: { list: {} },
          strides: { list: { i: ["1", "1", "1", "1"] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/global_average_pooling2d/Mean",
        op: "Mean",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d_15/depthwise",
          "StatefulPartitionedCall/model/global_average_pooling2d/Mean/reduction_indices",
        ],
        attr: {
          Tidx: { type: "DT_INT32" },
          T: { type: "DT_FLOAT" },
          keep_dims: { b: false },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv_handflag/BiasAdd",
        op: "_FusedMatMul",
        input: [
          "StatefulPartitionedCall/model/global_average_pooling2d/Mean",
          "StatefulPartitionedCall/model/conv_handflag/MatMul/ReadVariableOp",
          "StatefulPartitionedCall/model/conv_handflag/BiasAdd/ReadVariableOp",
        ],
        device: "/device:CPU:0",
        attr: {
          transpose_b: { b: false },
          epsilon: { f: 0.0 },
          num_args: { i: "1" },
          T: { type: "DT_FLOAT" },
          transpose_a: { b: false },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv_world_landmarks/BiasAdd",
        op: "_FusedMatMul",
        input: [
          "StatefulPartitionedCall/model/global_average_pooling2d/Mean",
          "StatefulPartitionedCall/model/conv_world_landmarks/MatMul/ReadVariableOp",
          "StatefulPartitionedCall/model/conv_world_landmarks/BiasAdd/ReadVariableOp",
        ],
        device: "/device:CPU:0",
        attr: {
          num_args: { i: "1" },
          epsilon: { f: 0.0 },
          transpose_b: { b: false },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          T: { type: "DT_FLOAT" },
          transpose_a: { b: false },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv_landmarks/BiasAdd",
        op: "_FusedMatMul",
        input: [
          "StatefulPartitionedCall/model/global_average_pooling2d/Mean",
          "StatefulPartitionedCall/model/conv_landmarks/MatMul/ReadVariableOp",
          "StatefulPartitionedCall/model/conv_landmarks/BiasAdd/ReadVariableOp",
        ],
        device: "/device:CPU:0",
        attr: {
          transpose_b: { b: false },
          transpose_a: { b: false },
          num_args: { i: "1" },
          T: { type: "DT_FLOAT" },
          epsilon: { f: 0.0 },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv_handedness/BiasAdd",
        op: "_FusedMatMul",
        input: [
          "StatefulPartitionedCall/model/global_average_pooling2d/Mean",
          "StatefulPartitionedCall/model/conv_handedness/MatMul/ReadVariableOp",
          "StatefulPartitionedCall/model/conv_handedness/BiasAdd/ReadVariableOp",
        ],
        device: "/device:CPU:0",
        attr: {
          transpose_a: { b: false },
          transpose_b: { b: false },
          num_args: { i: "1" },
          epsilon: { f: 0.0 },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          T: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/activation_handflag/Sigmoid",
        op: "Sigmoid",
        input: ["StatefulPartitionedCall/model/conv_handflag/BiasAdd"],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "Identity_3",
        op: "Identity",
        input: ["StatefulPartitionedCall/model/conv_world_landmarks/BiasAdd"],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "Identity_2",
        op: "Identity",
        input: ["StatefulPartitionedCall/model/conv_landmarks/BiasAdd"],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/activation_handedness/Sigmoid",
        op: "Sigmoid",
        input: ["StatefulPartitionedCall/model/conv_handedness/BiasAdd"],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "Identity_1",
        op: "Identity",
        input: ["StatefulPartitionedCall/model/activation_handflag/Sigmoid"],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "Identity",
        op: "Identity",
        input: ["StatefulPartitionedCall/model/activation_handedness/Sigmoid"],
        attr: { T: { type: "DT_FLOAT" } },
      },
    ],
    library: {},
    versions: {},
  },
  weightsManifest: [
    {
      paths: ["group1-shard1of1.bin"],
      weights: [
        {
          name: "StatefulPartitionedCall/model/conv_handedness/MatMul/ReadVariableOp",
          shape: [672, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv_handedness/BiasAdd/ReadVariableOp",
          shape: [1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv_handflag/MatMul/ReadVariableOp",
          shape: [672, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv_handflag/BiasAdd/ReadVariableOp",
          shape: [1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv_landmarks/MatMul/ReadVariableOp",
          shape: [672, 63],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv_landmarks/BiasAdd/ReadVariableOp",
          shape: [63],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/global_average_pooling2d/Mean/reduction_indices",
          shape: [2],
          dtype: "int32",
        },
        {
          name: "StatefulPartitionedCall/model/conv_world_landmarks/MatMul/ReadVariableOp",
          shape: [672, 63],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv_world_landmarks/BiasAdd/ReadVariableOp",
          shape: [63],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d/Conv2D_weights",
          shape: [3, 3, 3, 24],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d/Conv2D_bn_offset",
          shape: [24],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_13/depthwise_weights",
          shape: [5, 5, 672, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d/depthwise_weights",
          shape: [3, 3, 24, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d/depthwise_bn_offset",
          shape: [24],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_1/Conv2D_weights",
          shape: [1, 1, 24, 16],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_1/Conv2D_bn_offset",
          shape: [16],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_2/Conv2D_weights",
          shape: [1, 1, 16, 64],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_13/depthwise_bn_offset",
          shape: [672],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_2/Conv2D_bn_offset",
          shape: [64],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_1/depthwise_weights",
          shape: [3, 3, 64, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_1/depthwise_bn_offset",
          shape: [64],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_3/Conv2D_weights",
          shape: [1, 1, 64, 16],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_3/Conv2D_bn_offset",
          shape: [16],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_4/Conv2D_weights",
          shape: [1, 1, 16, 96],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_27/Conv2D_weights",
          shape: [1, 1, 672, 112],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_4/Conv2D_bn_offset",
          shape: [96],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_2/depthwise_weights",
          shape: [3, 3, 96, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_2/depthwise_bn_offset",
          shape: [96],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_5/Conv2D_weights",
          shape: [1, 1, 96, 16],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_27/Conv2D_bn_offset",
          shape: [112],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_5/Conv2D_bn_offset",
          shape: [16],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_6/Conv2D_weights",
          shape: [1, 1, 16, 96],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_6/Conv2D_bn_offset",
          shape: [96],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_3/depthwise_weights",
          shape: [5, 5, 96, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_3/depthwise_bn_offset",
          shape: [96],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_7/Conv2D_weights",
          shape: [1, 1, 96, 24],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_28/Conv2D_weights",
          shape: [1, 1, 112, 672],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_7/Conv2D_bn_offset",
          shape: [24],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_8/Conv2D_weights",
          shape: [1, 1, 24, 144],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_8/Conv2D_bn_offset",
          shape: [144],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_28/Conv2D_bn_offset",
          shape: [672],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_4/depthwise_weights",
          shape: [5, 5, 144, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_4/depthwise_bn_offset",
          shape: [144],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_9/Conv2D_weights",
          shape: [1, 1, 144, 24],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_9/Conv2D_bn_offset",
          shape: [24],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_10/Conv2D_weights",
          shape: [1, 1, 24, 144],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_10/Conv2D_bn_offset",
          shape: [144],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_14/depthwise_weights",
          shape: [5, 5, 672, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_5/depthwise_weights",
          shape: [3, 3, 144, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_5/depthwise_bn_offset",
          shape: [144],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_11/Conv2D_weights",
          shape: [1, 1, 144, 48],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_11/Conv2D_bn_offset",
          shape: [48],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_12/Conv2D_weights",
          shape: [1, 1, 48, 288],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_14/depthwise_bn_offset",
          shape: [672],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_12/Conv2D_bn_offset",
          shape: [288],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_6/depthwise_weights",
          shape: [3, 3, 288, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_6/depthwise_bn_offset",
          shape: [288],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_13/Conv2D_weights",
          shape: [1, 1, 288, 48],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_13/Conv2D_bn_offset",
          shape: [48],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_14/Conv2D_weights",
          shape: [1, 1, 48, 288],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_29/Conv2D_weights",
          shape: [1, 1, 672, 112],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_14/Conv2D_bn_offset",
          shape: [288],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_7/depthwise_weights",
          shape: [3, 3, 288, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_7/depthwise_bn_offset",
          shape: [288],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_15/Conv2D_weights",
          shape: [1, 1, 288, 48],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_29/Conv2D_bn_offset",
          shape: [112],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_15/Conv2D_bn_offset",
          shape: [48],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_16/Conv2D_weights",
          shape: [1, 1, 48, 288],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_16/Conv2D_bn_offset",
          shape: [288],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_8/depthwise_weights",
          shape: [5, 5, 288, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_8/depthwise_bn_offset",
          shape: [288],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_17/Conv2D_weights",
          shape: [1, 1, 288, 64],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_30/Conv2D_weights",
          shape: [1, 1, 112, 672],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_17/Conv2D_bn_offset",
          shape: [64],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_18/Conv2D_weights",
          shape: [1, 1, 64, 384],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_18/Conv2D_bn_offset",
          shape: [384],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_30/Conv2D_bn_offset",
          shape: [672],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_9/depthwise_weights",
          shape: [5, 5, 384, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_9/depthwise_bn_offset",
          shape: [384],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_19/Conv2D_weights",
          shape: [1, 1, 384, 64],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_19/Conv2D_bn_offset",
          shape: [64],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_20/Conv2D_weights",
          shape: [1, 1, 64, 384],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_20/Conv2D_bn_offset",
          shape: [384],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_15/depthwise_weights",
          shape: [3, 3, 672, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_10/depthwise_weights",
          shape: [5, 5, 384, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_10/depthwise_bn_offset",
          shape: [384],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_21/Conv2D_weights",
          shape: [1, 1, 384, 64],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_21/Conv2D_bn_offset",
          shape: [64],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_22/Conv2D_weights",
          shape: [1, 1, 64, 384],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_15/depthwise_bn_offset",
          shape: [672],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_22/Conv2D_bn_offset",
          shape: [384],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_11/depthwise_weights",
          shape: [5, 5, 384, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_11/depthwise_bn_offset",
          shape: [384],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_23/Conv2D_weights",
          shape: [1, 1, 384, 112],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_23/Conv2D_bn_offset",
          shape: [112],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_24/Conv2D_weights",
          shape: [1, 1, 112, 672],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_24/Conv2D_bn_offset",
          shape: [672],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_12/depthwise_weights",
          shape: [5, 5, 672, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_12/depthwise_bn_offset",
          shape: [672],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_25/Conv2D_weights",
          shape: [1, 1, 672, 112],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_25/Conv2D_bn_offset",
          shape: [112],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_26/Conv2D_weights",
          shape: [1, 1, 112, 672],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_26/Conv2D_bn_offset",
          shape: [672],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
      ],
    },
  ],
};

export default modelJson;
