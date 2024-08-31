const modelJson = {
  format: "graph-model",
  generatedBy: "2.8.0",
  convertedBy: "TensorFlow.js Converter v1.7.0",
  signature: {
    inputs: {
      input: {
        name: "input:0",
        dtype: "DT_FLOAT",
        tensorShape: {
          dim: [
            { size: "-1" },
            { size: "192" },
            { size: "192" },
            { size: "3" },
          ],
        },
      },
    },
    outputs: {
      palm: {
        name: "Identity:0",
        dtype: "DT_FLOAT",
        tensorShape: {
          dim: [{ size: "-1" }, { size: "2016" }, { size: "19" }],
        },
      },
    },
  },
  modelTopology: {
    node: [
      {
        name: "StatefulPartitionedCall/model/classifier_palm_8_NO_PRUNING/Conv2D/ReadVariableOp",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "128" },
                  { size: "2" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/classifier_palm_8_NO_PRUNING/BiasAdd/ReadVariableOp",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "2" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/reshaped_classifier_palm_8/strided_slice/stack",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_INT32",
              tensorShape: { dim: [{ size: "1" }] },
            },
          },
          dtype: { type: "DT_INT32" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/reshaped_classifier_palm_8/strided_slice/stack_1",
        op: "Const",
        attr: {
          dtype: { type: "DT_INT32" },
          value: {
            tensor: {
              dtype: "DT_INT32",
              tensorShape: { dim: [{ size: "1" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/reshaped_classifier_palm_8/strided_slice/stack_2",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_INT32",
              tensorShape: { dim: [{ size: "1" }] },
            },
          },
          dtype: { type: "DT_INT32" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/reshaped_classifier_palm_8/Reshape/shape/1",
        op: "Const",
        attr: {
          dtype: { type: "DT_INT32" },
          value: { tensor: { dtype: "DT_INT32", tensorShape: {} } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/reshaped_classifier_palm_8/Reshape/shape/2",
        op: "Const",
        attr: {
          value: { tensor: { dtype: "DT_INT32", tensorShape: {} } },
          dtype: { type: "DT_INT32" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/classifier_palm_16_NO_PRUNING/Conv2D/ReadVariableOp",
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
                  { size: "256" },
                  { size: "6" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/classifier_palm_16_NO_PRUNING/BiasAdd/ReadVariableOp",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "6" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/reshaped_classifier_palm_16/strided_slice/stack",
        op: "Const",
        attr: {
          dtype: { type: "DT_INT32" },
          value: {
            tensor: {
              dtype: "DT_INT32",
              tensorShape: { dim: [{ size: "1" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/reshaped_classifier_palm_16/strided_slice/stack_1",
        op: "Const",
        attr: {
          dtype: { type: "DT_INT32" },
          value: {
            tensor: {
              dtype: "DT_INT32",
              tensorShape: { dim: [{ size: "1" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/reshaped_classifier_palm_16/strided_slice/stack_2",
        op: "Const",
        attr: {
          dtype: { type: "DT_INT32" },
          value: {
            tensor: {
              dtype: "DT_INT32",
              tensorShape: { dim: [{ size: "1" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/reshaped_classifier_palm_16/Reshape/shape/1",
        op: "Const",
        attr: {
          value: { tensor: { dtype: "DT_INT32", tensorShape: {} } },
          dtype: { type: "DT_INT32" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/reshaped_classifier_palm_16/Reshape/shape/2",
        op: "Const",
        attr: {
          dtype: { type: "DT_INT32" },
          value: { tensor: { dtype: "DT_INT32", tensorShape: {} } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/classifiers_palm/concat/axis",
        op: "Const",
        attr: {
          dtype: { type: "DT_INT32" },
          value: { tensor: { dtype: "DT_INT32", tensorShape: {} } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_25/Neg",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [{ size: "1" }, { size: "1" }, { size: "128" }],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_24/Neg",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [{ size: "1" }, { size: "1" }, { size: "128" }],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_23/Neg",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [{ size: "1" }, { size: "1" }, { size: "128" }],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/up_sampling2d_1/mul",
        op: "Const",
        attr: {
          dtype: { type: "DT_INT32" },
          value: {
            tensor: {
              dtype: "DT_INT32",
              tensorShape: { dim: [{ size: "2" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_21/depthwise/ReadVariableOp",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "5" },
                  { size: "5" },
                  { size: "128" },
                  { size: "1" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_22/depthwise/ReadVariableOp",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "5" },
                  { size: "5" },
                  { size: "128" },
                  { size: "1" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/regressor_palm_8_NO_PRUNING/Conv2D/ReadVariableOp",
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
                  { size: "128" },
                  { size: "36" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/regressor_palm_8_NO_PRUNING/BiasAdd/ReadVariableOp",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "36" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/reshaped_regressor_palm_8/strided_slice/stack",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_INT32",
              tensorShape: { dim: [{ size: "1" }] },
            },
          },
          dtype: { type: "DT_INT32" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/reshaped_regressor_palm_8/strided_slice/stack_1",
        op: "Const",
        attr: {
          dtype: { type: "DT_INT32" },
          value: {
            tensor: {
              dtype: "DT_INT32",
              tensorShape: { dim: [{ size: "1" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/reshaped_regressor_palm_8/strided_slice/stack_2",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_INT32",
              tensorShape: { dim: [{ size: "1" }] },
            },
          },
          dtype: { type: "DT_INT32" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/reshaped_regressor_palm_8/Reshape/shape/1",
        op: "Const",
        attr: {
          dtype: { type: "DT_INT32" },
          value: { tensor: { dtype: "DT_INT32", tensorShape: {} } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/reshaped_regressor_palm_8/Reshape/shape/2",
        op: "Const",
        attr: {
          value: { tensor: { dtype: "DT_INT32", tensorShape: {} } },
          dtype: { type: "DT_INT32" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_22/Neg",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [{ size: "1" }, { size: "1" }, { size: "256" }],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_21/Neg",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [{ size: "1" }, { size: "1" }, { size: "256" }],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_20/Neg",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [{ size: "1" }, { size: "1" }, { size: "256" }],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_19/Neg",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [{ size: "1" }, { size: "1" }, { size: "256" }],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_18/Neg",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [{ size: "1" }, { size: "1" }, { size: "256" }],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_17/Neg",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [{ size: "1" }, { size: "1" }, { size: "256" }],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_16/Neg",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [{ size: "1" }, { size: "1" }, { size: "256" }],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_15/Neg",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [{ size: "1" }, { size: "1" }, { size: "256" }],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_14/Neg",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [{ size: "1" }, { size: "1" }, { size: "256" }],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_13/Neg",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [{ size: "1" }, { size: "1" }, { size: "256" }],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_12/Neg",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [{ size: "1" }, { size: "1" }, { size: "256" }],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/channel_padding_2/Pad/paddings",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_INT32",
              tensorShape: { dim: [{ size: "4" }, { size: "2" }] },
            },
          },
          dtype: { type: "DT_INT32" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_11/Neg",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [{ size: "1" }, { size: "1" }, { size: "128" }],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_10/Neg",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [{ size: "1" }, { size: "1" }, { size: "128" }],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_9/Neg",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [{ size: "1" }, { size: "1" }, { size: "128" }],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_8/Neg",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [{ size: "1" }, { size: "1" }, { size: "128" }],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/channel_padding_1/Pad/paddings",
        op: "Const",
        attr: {
          dtype: { type: "DT_INT32" },
          value: {
            tensor: {
              dtype: "DT_INT32",
              tensorShape: { dim: [{ size: "4" }, { size: "2" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_7/Neg",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [{ size: "1" }, { size: "1" }, { size: "64" }],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_6/Neg",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [{ size: "1" }, { size: "1" }, { size: "64" }],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_5/Neg",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [{ size: "1" }, { size: "1" }, { size: "64" }],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_4/Neg",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [{ size: "1" }, { size: "1" }, { size: "64" }],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/channel_padding/Pad/paddings",
        op: "Const",
        attr: {
          dtype: { type: "DT_INT32" },
          value: {
            tensor: {
              dtype: "DT_INT32",
              tensorShape: { dim: [{ size: "4" }, { size: "2" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_3/Neg",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [{ size: "1" }, { size: "1" }, { size: "32" }],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_2/Neg",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [{ size: "1" }, { size: "1" }, { size: "32" }],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_1/Neg",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [{ size: "1" }, { size: "1" }, { size: "32" }],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu/Neg",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [{ size: "1" }, { size: "1" }, { size: "32" }],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d/depthwise/ReadVariableOp",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "5" },
                  { size: "5" },
                  { size: "32" },
                  { size: "1" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_1/depthwise/ReadVariableOp",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "5" },
                  { size: "5" },
                  { size: "32" },
                  { size: "1" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_2/depthwise/ReadVariableOp",
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
                  { size: "32" },
                  { size: "1" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_3/depthwise/ReadVariableOp",
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
                  { size: "32" },
                  { size: "1" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_4/depthwise/ReadVariableOp",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "5" },
                  { size: "5" },
                  { size: "64" },
                  { size: "1" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_5/depthwise/ReadVariableOp",
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
                  { size: "64" },
                  { size: "1" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_6/depthwise/ReadVariableOp",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "5" },
                  { size: "5" },
                  { size: "64" },
                  { size: "1" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_7/depthwise/ReadVariableOp",
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
                  { size: "64" },
                  { size: "1" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_8/depthwise/ReadVariableOp",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "5" },
                  { size: "5" },
                  { size: "128" },
                  { size: "1" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_9/depthwise/ReadVariableOp",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "5" },
                  { size: "5" },
                  { size: "128" },
                  { size: "1" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_10/depthwise/ReadVariableOp",
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
                  { size: "128" },
                  { size: "1" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_11/depthwise/ReadVariableOp",
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
                  { size: "128" },
                  { size: "1" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_12/depthwise/ReadVariableOp",
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
                  { size: "256" },
                  { size: "1" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_13/depthwise/ReadVariableOp",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "5" },
                  { size: "5" },
                  { size: "256" },
                  { size: "1" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_14/depthwise/ReadVariableOp",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "5" },
                  { size: "5" },
                  { size: "256" },
                  { size: "1" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_15/depthwise/ReadVariableOp",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "5" },
                  { size: "5" },
                  { size: "256" },
                  { size: "1" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_16/depthwise/ReadVariableOp",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "5" },
                  { size: "5" },
                  { size: "256" },
                  { size: "1" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_17/depthwise/ReadVariableOp",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "5" },
                  { size: "5" },
                  { size: "256" },
                  { size: "1" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_18/depthwise/ReadVariableOp",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "5" },
                  { size: "5" },
                  { size: "256" },
                  { size: "1" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/up_sampling2d/mul",
        op: "Const",
        attr: {
          dtype: { type: "DT_INT32" },
          value: {
            tensor: {
              dtype: "DT_INT32",
              tensorShape: { dim: [{ size: "2" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_19/depthwise/ReadVariableOp",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "5" },
                  { size: "5" },
                  { size: "256" },
                  { size: "1" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_20/depthwise/ReadVariableOp",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "5" },
                  { size: "5" },
                  { size: "256" },
                  { size: "1" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/regressor_palm_16_NO_PRUNING/Conv2D/ReadVariableOp",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "256" },
                  { size: "108" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/regressor_palm_16_NO_PRUNING/BiasAdd/ReadVariableOp",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "108" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/reshaped_regressor_palm_16/strided_slice/stack",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_INT32",
              tensorShape: { dim: [{ size: "1" }] },
            },
          },
          dtype: { type: "DT_INT32" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/reshaped_regressor_palm_16/strided_slice/stack_1",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_INT32",
              tensorShape: { dim: [{ size: "1" }] },
            },
          },
          dtype: { type: "DT_INT32" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/reshaped_regressor_palm_16/strided_slice/stack_2",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_INT32",
              tensorShape: { dim: [{ size: "1" }] },
            },
          },
          dtype: { type: "DT_INT32" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/reshaped_regressor_palm_16/Reshape/shape/1",
        op: "Const",
        attr: {
          value: { tensor: { dtype: "DT_INT32", tensorShape: {} } },
          dtype: { type: "DT_INT32" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/reshaped_regressor_palm_16/Reshape/shape/2",
        op: "Const",
        attr: {
          value: { tensor: { dtype: "DT_INT32", tensorShape: {} } },
          dtype: { type: "DT_INT32" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/regressors_palm/concat/axis",
        op: "Const",
        attr: {
          dtype: { type: "DT_INT32" },
          value: { tensor: { dtype: "DT_INT32", tensorShape: {} } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/palm/concat/axis",
        op: "Const",
        attr: {
          dtype: { type: "DT_INT32" },
          value: { tensor: { dtype: "DT_INT32", tensorShape: {} } },
        },
      },
      {
        name: "input",
        op: "Placeholder",
        attr: {
          dtype: { type: "DT_FLOAT" },
          shape: {
            shape: {
              dim: [
                { size: "-1" },
                { size: "192" },
                { size: "192" },
                { size: "3" },
              ],
            },
          },
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
                  { size: "5" },
                  { size: "5" },
                  { size: "3" },
                  { size: "32" },
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
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "32" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_1/Conv2D_weights",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "32" },
                  { size: "32" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_1/Conv2D_bn_offset",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "32" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_2/Conv2D_weights",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "32" },
                  { size: "32" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_2/Conv2D_bn_offset",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "32" }] },
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
                  { size: "32" },
                  { size: "32" },
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
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "32" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
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
                  { size: "32" },
                  { size: "64" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_25/Conv2D_weights",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "128" },
                  { size: "128" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_4/Conv2D_bn_offset",
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
        name: "StatefulPartitionedCall/model/conv2d_5/Conv2D_weights",
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
                  { size: "64" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_5/Conv2D_bn_offset",
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
        name: "StatefulPartitionedCall/model/conv2d_6/Conv2D_weights",
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
                  { size: "64" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_25/Conv2D_bn_offset",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "128" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_6/Conv2D_bn_offset",
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
                  { size: "64" },
                  { size: "64" },
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
              tensorShape: { dim: [{ size: "64" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_8/Conv2D_weights",
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
                  { size: "128" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_8/Conv2D_bn_offset",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "128" }] },
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
                  { size: "128" },
                  { size: "128" },
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
              tensorShape: { dim: [{ size: "128" }] },
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
                  { size: "128" },
                  { size: "128" },
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
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "128" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_11/Conv2D_weights",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "128" },
                  { size: "128" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_11/Conv2D_bn_offset",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "128" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
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
                  { size: "128" },
                  { size: "256" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_12/Conv2D_bn_offset",
        op: "Const",
        attr: {
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "256" }] },
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
                  { size: "256" },
                  { size: "256" },
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
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "256" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_14/Conv2D_weights",
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
                  { size: "256" },
                  { size: "256" },
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
              tensorShape: { dim: [{ size: "256" }] },
            },
          },
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
                  { size: "256" },
                  { size: "256" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_15/Conv2D_bn_offset",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "256" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
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
                  { size: "256" },
                  { size: "256" },
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
              tensorShape: { dim: [{ size: "256" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
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
                  { size: "256" },
                  { size: "256" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_17/Conv2D_bn_offset",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "256" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_18/Conv2D_weights",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "256" },
                  { size: "256" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
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
              tensorShape: { dim: [{ size: "256" }] },
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
                  { size: "256" },
                  { size: "256" },
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
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "256" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
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
                  { size: "256" },
                  { size: "256" },
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
          dtype: { type: "DT_FLOAT" },
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "256" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_21/Conv2D_weights",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: {
                dim: [
                  { size: "1" },
                  { size: "1" },
                  { size: "256" },
                  { size: "256" },
                ],
              },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_21/Conv2D_bn_offset",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "256" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_22/Conv2D_weights",
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
                  { size: "256" },
                  { size: "256" },
                ],
              },
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
              tensorShape: { dim: [{ size: "256" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_23/Conv2D_weights",
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
                  { size: "256" },
                  { size: "128" },
                ],
              },
            },
          },
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
              tensorShape: { dim: [{ size: "128" }] },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_24/Conv2D_weights",
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
                  { size: "128" },
                  { size: "128" },
                ],
              },
            },
          },
        },
      },
      {
        name: "StatefulPartitionedCall/model/conv2d_24/Conv2D_bn_offset",
        op: "Const",
        attr: {
          value: {
            tensor: {
              dtype: "DT_FLOAT",
              tensorShape: { dim: [{ size: "128" }] },
            },
          },
          dtype: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "input",
          "StatefulPartitionedCall/model/conv2d/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d/Conv2D_bn_offset",
          "StatefulPartitionedCall/model/p_re_lu/Neg",
        ],
        device: "/device:CPU:0",
        attr: {
          fused_ops: { list: { s: ["Qmlhc0FkZA==", "UHJlbHU="] } },
          num_args: { i: "2" },
          padding: { s: "U0FNRQ==" },
          T: { type: "DT_FLOAT" },
          strides: { list: { i: ["1", "2", "2", "1"] } },
          use_cudnn_on_gpu: { b: true },
          data_format: { s: "TkhXQw==" },
          epsilon: { f: 0.0 },
          explicit_paddings: { list: {} },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d/depthwise",
        op: "DepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/batch_normalization/FusedBatchNormV3",
          "StatefulPartitionedCall/model/depthwise_conv2d/depthwise/ReadVariableOp",
        ],
        attr: {
          padding: { s: "U0FNRQ==" },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          T: { type: "DT_FLOAT" },
          data_format: { s: "TkhXQw==" },
          explicit_paddings: { list: {} },
        },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_1/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d/depthwise",
          "StatefulPartitionedCall/model/conv2d_1/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_1/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          explicit_paddings: { list: {} },
          T: { type: "DT_FLOAT" },
          use_cudnn_on_gpu: { b: true },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          epsilon: { f: 0.0 },
          data_format: { s: "TkhXQw==" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          padding: { s: "VkFMSUQ=" },
          num_args: { i: "1" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/add/add",
        op: "AddV2",
        input: [
          "StatefulPartitionedCall/model/batch_normalization/FusedBatchNormV3",
          "StatefulPartitionedCall/model/batch_normalization_1/FusedBatchNormV3",
        ],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_1/Relu",
        op: "Prelu",
        input: [
          "StatefulPartitionedCall/model/add/add",
          "StatefulPartitionedCall/model/p_re_lu_1/Neg",
        ],
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_1/depthwise",
        op: "DepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_1/Relu",
          "StatefulPartitionedCall/model/depthwise_conv2d_1/depthwise/ReadVariableOp",
        ],
        attr: {
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          T: { type: "DT_FLOAT" },
          padding: { s: "U0FNRQ==" },
          data_format: { s: "TkhXQw==" },
          explicit_paddings: { list: {} },
          strides: { list: { i: ["1", "1", "1", "1"] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_2/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d_1/depthwise",
          "StatefulPartitionedCall/model/conv2d_2/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_2/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          explicit_paddings: { list: {} },
          padding: { s: "VkFMSUQ=" },
          num_args: { i: "1" },
          epsilon: { f: 0.0 },
          data_format: { s: "TkhXQw==" },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          T: { type: "DT_FLOAT" },
          use_cudnn_on_gpu: { b: true },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/add_1/add",
        op: "AddV2",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_1/Relu",
          "StatefulPartitionedCall/model/batch_normalization_2/FusedBatchNormV3",
        ],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_2/Relu",
        op: "Prelu",
        input: [
          "StatefulPartitionedCall/model/add_1/add",
          "StatefulPartitionedCall/model/p_re_lu_2/Neg",
        ],
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_2/depthwise",
        op: "DepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_2/Relu",
          "StatefulPartitionedCall/model/depthwise_conv2d_2/depthwise/ReadVariableOp",
        ],
        attr: {
          data_format: { s: "TkhXQw==" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          T: { type: "DT_FLOAT" },
          explicit_paddings: { list: {} },
          padding: { s: "U0FNRQ==" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_3/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d_2/depthwise",
          "StatefulPartitionedCall/model/conv2d_3/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_3/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          T: { type: "DT_FLOAT" },
          num_args: { i: "1" },
          data_format: { s: "TkhXQw==" },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          epsilon: { f: 0.0 },
          explicit_paddings: { list: {} },
          use_cudnn_on_gpu: { b: true },
          padding: { s: "VkFMSUQ=" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/add_2/add",
        op: "AddV2",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_2/Relu",
          "StatefulPartitionedCall/model/batch_normalization_3/FusedBatchNormV3",
        ],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_3/Relu",
        op: "Prelu",
        input: [
          "StatefulPartitionedCall/model/add_2/add",
          "StatefulPartitionedCall/model/p_re_lu_3/Neg",
        ],
      },
      {
        name: "StatefulPartitionedCall/model/max_pooling2d/MaxPool",
        op: "MaxPool",
        input: ["StatefulPartitionedCall/model/p_re_lu_3/Relu"],
        attr: {
          strides: { list: { i: ["1", "2", "2", "1"] } },
          data_format: { s: "TkhXQw==" },
          padding: { s: "U0FNRQ==" },
          explicit_paddings: { list: {} },
          T: { type: "DT_FLOAT" },
          ksize: { list: { i: ["1", "2", "2", "1"] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_3/depthwise",
        op: "DepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_3/Relu",
          "StatefulPartitionedCall/model/depthwise_conv2d_3/depthwise/ReadVariableOp",
        ],
        attr: {
          T: { type: "DT_FLOAT" },
          explicit_paddings: { list: {} },
          padding: { s: "U0FNRQ==" },
          data_format: { s: "TkhXQw==" },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          strides: { list: { i: ["1", "2", "2", "1"] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/channel_padding/Pad",
        op: "Pad",
        input: [
          "StatefulPartitionedCall/model/max_pooling2d/MaxPool",
          "StatefulPartitionedCall/model/channel_padding/Pad/paddings",
        ],
        attr: { T: { type: "DT_FLOAT" }, Tpaddings: { type: "DT_INT32" } },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_4/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d_3/depthwise",
          "StatefulPartitionedCall/model/conv2d_4/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_4/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          num_args: { i: "1" },
          explicit_paddings: { list: {} },
          use_cudnn_on_gpu: { b: true },
          data_format: { s: "TkhXQw==" },
          T: { type: "DT_FLOAT" },
          padding: { s: "VkFMSUQ=" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          epsilon: { f: 0.0 },
        },
      },
      {
        name: "StatefulPartitionedCall/model/add_3/add",
        op: "AddV2",
        input: [
          "StatefulPartitionedCall/model/channel_padding/Pad",
          "StatefulPartitionedCall/model/batch_normalization_4/FusedBatchNormV3",
        ],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_4/Relu",
        op: "Prelu",
        input: [
          "StatefulPartitionedCall/model/add_3/add",
          "StatefulPartitionedCall/model/p_re_lu_4/Neg",
        ],
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_4/depthwise",
        op: "DepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_4/Relu",
          "StatefulPartitionedCall/model/depthwise_conv2d_4/depthwise/ReadVariableOp",
        ],
        attr: {
          data_format: { s: "TkhXQw==" },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          T: { type: "DT_FLOAT" },
          explicit_paddings: { list: {} },
          padding: { s: "U0FNRQ==" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_5/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d_4/depthwise",
          "StatefulPartitionedCall/model/conv2d_5/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_5/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          strides: { list: { i: ["1", "1", "1", "1"] } },
          T: { type: "DT_FLOAT" },
          epsilon: { f: 0.0 },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          data_format: { s: "TkhXQw==" },
          padding: { s: "VkFMSUQ=" },
          use_cudnn_on_gpu: { b: true },
          num_args: { i: "1" },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          explicit_paddings: { list: {} },
        },
      },
      {
        name: "StatefulPartitionedCall/model/add_4/add",
        op: "AddV2",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_4/Relu",
          "StatefulPartitionedCall/model/batch_normalization_5/FusedBatchNormV3",
        ],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_5/Relu",
        op: "Prelu",
        input: [
          "StatefulPartitionedCall/model/add_4/add",
          "StatefulPartitionedCall/model/p_re_lu_5/Neg",
        ],
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_5/depthwise",
        op: "DepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_5/Relu",
          "StatefulPartitionedCall/model/depthwise_conv2d_5/depthwise/ReadVariableOp",
        ],
        attr: {
          padding: { s: "U0FNRQ==" },
          data_format: { s: "TkhXQw==" },
          explicit_paddings: { list: {} },
          T: { type: "DT_FLOAT" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_6/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d_5/depthwise",
          "StatefulPartitionedCall/model/conv2d_6/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_6/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          explicit_paddings: { list: {} },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          data_format: { s: "TkhXQw==" },
          use_cudnn_on_gpu: { b: true },
          T: { type: "DT_FLOAT" },
          num_args: { i: "1" },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          epsilon: { f: 0.0 },
          padding: { s: "VkFMSUQ=" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/add_5/add",
        op: "AddV2",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_5/Relu",
          "StatefulPartitionedCall/model/batch_normalization_6/FusedBatchNormV3",
        ],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_6/Relu",
        op: "Prelu",
        input: [
          "StatefulPartitionedCall/model/add_5/add",
          "StatefulPartitionedCall/model/p_re_lu_6/Neg",
        ],
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_6/depthwise",
        op: "DepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_6/Relu",
          "StatefulPartitionedCall/model/depthwise_conv2d_6/depthwise/ReadVariableOp",
        ],
        attr: {
          padding: { s: "U0FNRQ==" },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          T: { type: "DT_FLOAT" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          explicit_paddings: { list: {} },
          data_format: { s: "TkhXQw==" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_7/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d_6/depthwise",
          "StatefulPartitionedCall/model/conv2d_7/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_7/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          explicit_paddings: { list: {} },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          use_cudnn_on_gpu: { b: true },
          padding: { s: "VkFMSUQ=" },
          T: { type: "DT_FLOAT" },
          data_format: { s: "TkhXQw==" },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          num_args: { i: "1" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          epsilon: { f: 0.0 },
        },
      },
      {
        name: "StatefulPartitionedCall/model/add_6/add",
        op: "AddV2",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_6/Relu",
          "StatefulPartitionedCall/model/batch_normalization_7/FusedBatchNormV3",
        ],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_7/Relu",
        op: "Prelu",
        input: [
          "StatefulPartitionedCall/model/add_6/add",
          "StatefulPartitionedCall/model/p_re_lu_7/Neg",
        ],
      },
      {
        name: "StatefulPartitionedCall/model/max_pooling2d_1/MaxPool",
        op: "MaxPool",
        input: ["StatefulPartitionedCall/model/p_re_lu_7/Relu"],
        attr: {
          strides: { list: { i: ["1", "2", "2", "1"] } },
          data_format: { s: "TkhXQw==" },
          explicit_paddings: { list: {} },
          T: { type: "DT_FLOAT" },
          padding: { s: "U0FNRQ==" },
          ksize: { list: { i: ["1", "2", "2", "1"] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_7/depthwise",
        op: "DepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_7/Relu",
          "StatefulPartitionedCall/model/depthwise_conv2d_7/depthwise/ReadVariableOp",
        ],
        attr: {
          strides: { list: { i: ["1", "2", "2", "1"] } },
          T: { type: "DT_FLOAT" },
          explicit_paddings: { list: {} },
          data_format: { s: "TkhXQw==" },
          padding: { s: "U0FNRQ==" },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/channel_padding_1/Pad",
        op: "Pad",
        input: [
          "StatefulPartitionedCall/model/max_pooling2d_1/MaxPool",
          "StatefulPartitionedCall/model/channel_padding_1/Pad/paddings",
        ],
        attr: { Tpaddings: { type: "DT_INT32" }, T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_8/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d_7/depthwise",
          "StatefulPartitionedCall/model/conv2d_8/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_8/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          use_cudnn_on_gpu: { b: true },
          explicit_paddings: { list: {} },
          padding: { s: "VkFMSUQ=" },
          T: { type: "DT_FLOAT" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          data_format: { s: "TkhXQw==" },
          epsilon: { f: 0.0 },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          num_args: { i: "1" },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/add_7/add",
        op: "AddV2",
        input: [
          "StatefulPartitionedCall/model/channel_padding_1/Pad",
          "StatefulPartitionedCall/model/batch_normalization_8/FusedBatchNormV3",
        ],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_8/Relu",
        op: "Prelu",
        input: [
          "StatefulPartitionedCall/model/add_7/add",
          "StatefulPartitionedCall/model/p_re_lu_8/Neg",
        ],
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_8/depthwise",
        op: "DepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_8/Relu",
          "StatefulPartitionedCall/model/depthwise_conv2d_8/depthwise/ReadVariableOp",
        ],
        attr: {
          padding: { s: "U0FNRQ==" },
          explicit_paddings: { list: {} },
          data_format: { s: "TkhXQw==" },
          T: { type: "DT_FLOAT" },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          strides: { list: { i: ["1", "1", "1", "1"] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_9/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d_8/depthwise",
          "StatefulPartitionedCall/model/conv2d_9/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_9/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          epsilon: { f: 0.0 },
          padding: { s: "VkFMSUQ=" },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          T: { type: "DT_FLOAT" },
          num_args: { i: "1" },
          explicit_paddings: { list: {} },
          use_cudnn_on_gpu: { b: true },
          data_format: { s: "TkhXQw==" },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          strides: { list: { i: ["1", "1", "1", "1"] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/add_8/add",
        op: "AddV2",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_8/Relu",
          "StatefulPartitionedCall/model/batch_normalization_9/FusedBatchNormV3",
        ],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_9/Relu",
        op: "Prelu",
        input: [
          "StatefulPartitionedCall/model/add_8/add",
          "StatefulPartitionedCall/model/p_re_lu_9/Neg",
        ],
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_9/depthwise",
        op: "DepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_9/Relu",
          "StatefulPartitionedCall/model/depthwise_conv2d_9/depthwise/ReadVariableOp",
        ],
        attr: {
          padding: { s: "U0FNRQ==" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          explicit_paddings: { list: {} },
          T: { type: "DT_FLOAT" },
          data_format: { s: "TkhXQw==" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_10/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d_9/depthwise",
          "StatefulPartitionedCall/model/conv2d_10/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_10/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          padding: { s: "VkFMSUQ=" },
          epsilon: { f: 0.0 },
          T: { type: "DT_FLOAT" },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          data_format: { s: "TkhXQw==" },
          explicit_paddings: { list: {} },
          use_cudnn_on_gpu: { b: true },
          num_args: { i: "1" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/add_9/add",
        op: "AddV2",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_9/Relu",
          "StatefulPartitionedCall/model/batch_normalization_10/FusedBatchNormV3",
        ],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_10/Relu",
        op: "Prelu",
        input: [
          "StatefulPartitionedCall/model/add_9/add",
          "StatefulPartitionedCall/model/p_re_lu_10/Neg",
        ],
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_10/depthwise",
        op: "DepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_10/Relu",
          "StatefulPartitionedCall/model/depthwise_conv2d_10/depthwise/ReadVariableOp",
        ],
        attr: {
          strides: { list: { i: ["1", "1", "1", "1"] } },
          padding: { s: "U0FNRQ==" },
          explicit_paddings: { list: {} },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          data_format: { s: "TkhXQw==" },
          T: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_11/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d_10/depthwise",
          "StatefulPartitionedCall/model/conv2d_11/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_11/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          epsilon: { f: 0.0 },
          padding: { s: "VkFMSUQ=" },
          num_args: { i: "1" },
          T: { type: "DT_FLOAT" },
          data_format: { s: "TkhXQw==" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          explicit_paddings: { list: {} },
          use_cudnn_on_gpu: { b: true },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/add_10/add",
        op: "AddV2",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_10/Relu",
          "StatefulPartitionedCall/model/batch_normalization_11/FusedBatchNormV3",
        ],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_11/Relu",
        op: "Prelu",
        input: [
          "StatefulPartitionedCall/model/add_10/add",
          "StatefulPartitionedCall/model/p_re_lu_11/Neg",
        ],
      },
      {
        name: "StatefulPartitionedCall/model/max_pooling2d_2/MaxPool",
        op: "MaxPool",
        input: ["StatefulPartitionedCall/model/p_re_lu_11/Relu"],
        attr: {
          data_format: { s: "TkhXQw==" },
          explicit_paddings: { list: {} },
          ksize: { list: { i: ["1", "2", "2", "1"] } },
          padding: { s: "U0FNRQ==" },
          strides: { list: { i: ["1", "2", "2", "1"] } },
          T: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_11/depthwise",
        op: "DepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_11/Relu",
          "StatefulPartitionedCall/model/depthwise_conv2d_11/depthwise/ReadVariableOp",
        ],
        attr: {
          data_format: { s: "TkhXQw==" },
          explicit_paddings: { list: {} },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          T: { type: "DT_FLOAT" },
          strides: { list: { i: ["1", "2", "2", "1"] } },
          padding: { s: "U0FNRQ==" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/channel_padding_2/Pad",
        op: "Pad",
        input: [
          "StatefulPartitionedCall/model/max_pooling2d_2/MaxPool",
          "StatefulPartitionedCall/model/channel_padding_2/Pad/paddings",
        ],
        attr: { Tpaddings: { type: "DT_INT32" }, T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_12/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d_11/depthwise",
          "StatefulPartitionedCall/model/conv2d_12/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_12/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          use_cudnn_on_gpu: { b: true },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          T: { type: "DT_FLOAT" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          data_format: { s: "TkhXQw==" },
          padding: { s: "VkFMSUQ=" },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          num_args: { i: "1" },
          epsilon: { f: 0.0 },
          explicit_paddings: { list: {} },
        },
      },
      {
        name: "StatefulPartitionedCall/model/add_11/add",
        op: "AddV2",
        input: [
          "StatefulPartitionedCall/model/channel_padding_2/Pad",
          "StatefulPartitionedCall/model/batch_normalization_12/FusedBatchNormV3",
        ],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_12/Relu",
        op: "Prelu",
        input: [
          "StatefulPartitionedCall/model/add_11/add",
          "StatefulPartitionedCall/model/p_re_lu_12/Neg",
        ],
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_12/depthwise",
        op: "DepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_12/Relu",
          "StatefulPartitionedCall/model/depthwise_conv2d_12/depthwise/ReadVariableOp",
        ],
        attr: {
          explicit_paddings: { list: {} },
          T: { type: "DT_FLOAT" },
          data_format: { s: "TkhXQw==" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          padding: { s: "U0FNRQ==" },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_13/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d_12/depthwise",
          "StatefulPartitionedCall/model/conv2d_13/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_13/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          padding: { s: "VkFMSUQ=" },
          data_format: { s: "TkhXQw==" },
          T: { type: "DT_FLOAT" },
          epsilon: { f: 0.0 },
          num_args: { i: "1" },
          explicit_paddings: { list: {} },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          use_cudnn_on_gpu: { b: true },
        },
      },
      {
        name: "StatefulPartitionedCall/model/add_12/add",
        op: "AddV2",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_12/Relu",
          "StatefulPartitionedCall/model/batch_normalization_13/FusedBatchNormV3",
        ],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_13/Relu",
        op: "Prelu",
        input: [
          "StatefulPartitionedCall/model/add_12/add",
          "StatefulPartitionedCall/model/p_re_lu_13/Neg",
        ],
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_13/depthwise",
        op: "DepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_13/Relu",
          "StatefulPartitionedCall/model/depthwise_conv2d_13/depthwise/ReadVariableOp",
        ],
        attr: {
          T: { type: "DT_FLOAT" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          data_format: { s: "TkhXQw==" },
          padding: { s: "U0FNRQ==" },
          explicit_paddings: { list: {} },
        },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_14/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d_13/depthwise",
          "StatefulPartitionedCall/model/conv2d_14/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_14/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          use_cudnn_on_gpu: { b: true },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          padding: { s: "VkFMSUQ=" },
          explicit_paddings: { list: {} },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          epsilon: { f: 0.0 },
          num_args: { i: "1" },
          data_format: { s: "TkhXQw==" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          T: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/add_13/add",
        op: "AddV2",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_13/Relu",
          "StatefulPartitionedCall/model/batch_normalization_14/FusedBatchNormV3",
        ],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_14/Relu",
        op: "Prelu",
        input: [
          "StatefulPartitionedCall/model/add_13/add",
          "StatefulPartitionedCall/model/p_re_lu_14/Neg",
        ],
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_14/depthwise",
        op: "DepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_14/Relu",
          "StatefulPartitionedCall/model/depthwise_conv2d_14/depthwise/ReadVariableOp",
        ],
        attr: {
          explicit_paddings: { list: {} },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          padding: { s: "U0FNRQ==" },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          T: { type: "DT_FLOAT" },
          data_format: { s: "TkhXQw==" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_15/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d_14/depthwise",
          "StatefulPartitionedCall/model/conv2d_15/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_15/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          T: { type: "DT_FLOAT" },
          explicit_paddings: { list: {} },
          padding: { s: "VkFMSUQ=" },
          num_args: { i: "1" },
          data_format: { s: "TkhXQw==" },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          epsilon: { f: 0.0 },
          use_cudnn_on_gpu: { b: true },
          strides: { list: { i: ["1", "1", "1", "1"] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/add_14/add",
        op: "AddV2",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_14/Relu",
          "StatefulPartitionedCall/model/batch_normalization_15/FusedBatchNormV3",
        ],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_15/Relu",
        op: "Prelu",
        input: [
          "StatefulPartitionedCall/model/add_14/add",
          "StatefulPartitionedCall/model/p_re_lu_15/Neg",
        ],
      },
      {
        name: "StatefulPartitionedCall/model/max_pooling2d_3/MaxPool",
        op: "MaxPool",
        input: ["StatefulPartitionedCall/model/p_re_lu_15/Relu"],
        attr: {
          explicit_paddings: { list: {} },
          T: { type: "DT_FLOAT" },
          padding: { s: "U0FNRQ==" },
          strides: { list: { i: ["1", "2", "2", "1"] } },
          ksize: { list: { i: ["1", "2", "2", "1"] } },
          data_format: { s: "TkhXQw==" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_15/depthwise",
        op: "DepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_15/Relu",
          "StatefulPartitionedCall/model/depthwise_conv2d_15/depthwise/ReadVariableOp",
        ],
        attr: {
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          explicit_paddings: { list: {} },
          T: { type: "DT_FLOAT" },
          strides: { list: { i: ["1", "2", "2", "1"] } },
          padding: { s: "U0FNRQ==" },
          data_format: { s: "TkhXQw==" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_16/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d_15/depthwise",
          "StatefulPartitionedCall/model/conv2d_16/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_16/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          explicit_paddings: { list: {} },
          num_args: { i: "1" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          data_format: { s: "TkhXQw==" },
          T: { type: "DT_FLOAT" },
          use_cudnn_on_gpu: { b: true },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          padding: { s: "VkFMSUQ=" },
          epsilon: { f: 0.0 },
        },
      },
      {
        name: "StatefulPartitionedCall/model/add_15/add",
        op: "AddV2",
        input: [
          "StatefulPartitionedCall/model/max_pooling2d_3/MaxPool",
          "StatefulPartitionedCall/model/batch_normalization_16/FusedBatchNormV3",
        ],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_16/Relu",
        op: "Prelu",
        input: [
          "StatefulPartitionedCall/model/add_15/add",
          "StatefulPartitionedCall/model/p_re_lu_16/Neg",
        ],
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_16/depthwise",
        op: "DepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_16/Relu",
          "StatefulPartitionedCall/model/depthwise_conv2d_16/depthwise/ReadVariableOp",
        ],
        attr: {
          padding: { s: "U0FNRQ==" },
          T: { type: "DT_FLOAT" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          explicit_paddings: { list: {} },
          data_format: { s: "TkhXQw==" },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_17/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d_16/depthwise",
          "StatefulPartitionedCall/model/conv2d_17/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_17/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          T: { type: "DT_FLOAT" },
          use_cudnn_on_gpu: { b: true },
          epsilon: { f: 0.0 },
          explicit_paddings: { list: {} },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          num_args: { i: "1" },
          padding: { s: "VkFMSUQ=" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          data_format: { s: "TkhXQw==" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/add_16/add",
        op: "AddV2",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_16/Relu",
          "StatefulPartitionedCall/model/batch_normalization_17/FusedBatchNormV3",
        ],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_17/Relu",
        op: "Prelu",
        input: [
          "StatefulPartitionedCall/model/add_16/add",
          "StatefulPartitionedCall/model/p_re_lu_17/Neg",
        ],
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_17/depthwise",
        op: "DepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_17/Relu",
          "StatefulPartitionedCall/model/depthwise_conv2d_17/depthwise/ReadVariableOp",
        ],
        attr: {
          data_format: { s: "TkhXQw==" },
          explicit_paddings: { list: {} },
          T: { type: "DT_FLOAT" },
          padding: { s: "U0FNRQ==" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_18/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d_17/depthwise",
          "StatefulPartitionedCall/model/conv2d_18/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_18/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          epsilon: { f: 0.0 },
          padding: { s: "VkFMSUQ=" },
          num_args: { i: "1" },
          data_format: { s: "TkhXQw==" },
          use_cudnn_on_gpu: { b: true },
          explicit_paddings: { list: {} },
          T: { type: "DT_FLOAT" },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          strides: { list: { i: ["1", "1", "1", "1"] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/add_17/add",
        op: "AddV2",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_17/Relu",
          "StatefulPartitionedCall/model/batch_normalization_18/FusedBatchNormV3",
        ],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_18/Relu",
        op: "Prelu",
        input: [
          "StatefulPartitionedCall/model/add_17/add",
          "StatefulPartitionedCall/model/p_re_lu_18/Neg",
        ],
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_18/depthwise",
        op: "DepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_18/Relu",
          "StatefulPartitionedCall/model/depthwise_conv2d_18/depthwise/ReadVariableOp",
        ],
        attr: {
          data_format: { s: "TkhXQw==" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          explicit_paddings: { list: {} },
          T: { type: "DT_FLOAT" },
          padding: { s: "U0FNRQ==" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_19/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d_18/depthwise",
          "StatefulPartitionedCall/model/conv2d_19/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_19/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          epsilon: { f: 0.0 },
          padding: { s: "VkFMSUQ=" },
          use_cudnn_on_gpu: { b: true },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          data_format: { s: "TkhXQw==" },
          T: { type: "DT_FLOAT" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          num_args: { i: "1" },
          explicit_paddings: { list: {} },
        },
      },
      {
        name: "StatefulPartitionedCall/model/add_18/add",
        op: "AddV2",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_18/Relu",
          "StatefulPartitionedCall/model/batch_normalization_19/FusedBatchNormV3",
        ],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_19/Relu",
        op: "Prelu",
        input: [
          "StatefulPartitionedCall/model/add_18/add",
          "StatefulPartitionedCall/model/p_re_lu_19/Neg",
        ],
      },
      {
        name: "StatefulPartitionedCall/model/up_sampling2d/resize/ResizeBilinear",
        op: "ResizeBilinear",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_19/Relu",
          "StatefulPartitionedCall/model/up_sampling2d/mul",
        ],
        attr: {
          half_pixel_centers: { b: true },
          align_corners: { b: false },
          T: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_20/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/up_sampling2d/resize/ResizeBilinear",
          "StatefulPartitionedCall/model/conv2d_20/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_20/Conv2D_bn_offset",
          "StatefulPartitionedCall/model/p_re_lu_20/Neg",
        ],
        device: "/device:CPU:0",
        attr: {
          T: { type: "DT_FLOAT" },
          data_format: { s: "TkhXQw==" },
          epsilon: { f: 0.0 },
          explicit_paddings: { list: {} },
          fused_ops: { list: { s: ["Qmlhc0FkZA==", "UHJlbHU="] } },
          num_args: { i: "2" },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          use_cudnn_on_gpu: { b: true },
          padding: { s: "VkFMSUQ=" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/add_19/add",
        op: "AddV2",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_15/Relu",
          "StatefulPartitionedCall/model/batch_normalization_20/FusedBatchNormV3",
        ],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_19/depthwise",
        op: "DepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/add_19/add",
          "StatefulPartitionedCall/model/depthwise_conv2d_19/depthwise/ReadVariableOp",
        ],
        attr: {
          padding: { s: "U0FNRQ==" },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          T: { type: "DT_FLOAT" },
          data_format: { s: "TkhXQw==" },
          explicit_paddings: { list: {} },
          strides: { list: { i: ["1", "1", "1", "1"] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_21/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d_19/depthwise",
          "StatefulPartitionedCall/model/conv2d_21/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_21/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          strides: { list: { i: ["1", "1", "1", "1"] } },
          epsilon: { f: 0.0 },
          explicit_paddings: { list: {} },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          padding: { s: "VkFMSUQ=" },
          data_format: { s: "TkhXQw==" },
          num_args: { i: "1" },
          T: { type: "DT_FLOAT" },
          use_cudnn_on_gpu: { b: true },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/add_20/add",
        op: "AddV2",
        input: [
          "StatefulPartitionedCall/model/add_19/add",
          "StatefulPartitionedCall/model/batch_normalization_21/FusedBatchNormV3",
        ],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_21/Relu",
        op: "Prelu",
        input: [
          "StatefulPartitionedCall/model/add_20/add",
          "StatefulPartitionedCall/model/p_re_lu_21/Neg",
        ],
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_20/depthwise",
        op: "DepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_21/Relu",
          "StatefulPartitionedCall/model/depthwise_conv2d_20/depthwise/ReadVariableOp",
        ],
        attr: {
          padding: { s: "U0FNRQ==" },
          explicit_paddings: { list: {} },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          data_format: { s: "TkhXQw==" },
          T: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_22/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d_20/depthwise",
          "StatefulPartitionedCall/model/conv2d_22/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_22/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          use_cudnn_on_gpu: { b: true },
          padding: { s: "VkFMSUQ=" },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          num_args: { i: "1" },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          explicit_paddings: { list: {} },
          T: { type: "DT_FLOAT" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          data_format: { s: "TkhXQw==" },
          epsilon: { f: 0.0 },
        },
      },
      {
        name: "StatefulPartitionedCall/model/add_21/add",
        op: "AddV2",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_21/Relu",
          "StatefulPartitionedCall/model/batch_normalization_22/FusedBatchNormV3",
        ],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_22/Relu",
        op: "Prelu",
        input: [
          "StatefulPartitionedCall/model/add_21/add",
          "StatefulPartitionedCall/model/p_re_lu_22/Neg",
        ],
      },
      {
        name: "StatefulPartitionedCall/model/classifier_palm_16_NO_PRUNING/BiasAdd",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_22/Relu",
          "StatefulPartitionedCall/model/classifier_palm_16_NO_PRUNING/Conv2D/ReadVariableOp",
          "StatefulPartitionedCall/model/classifier_palm_16_NO_PRUNING/BiasAdd/ReadVariableOp",
        ],
        device: "/device:CPU:0",
        attr: {
          use_cudnn_on_gpu: { b: true },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          T: { type: "DT_FLOAT" },
          num_args: { i: "1" },
          epsilon: { f: 0.0 },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          explicit_paddings: { list: {} },
          data_format: { s: "TkhXQw==" },
          padding: { s: "U0FNRQ==" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/up_sampling2d_1/resize/ResizeBilinear",
        op: "ResizeBilinear",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_22/Relu",
          "StatefulPartitionedCall/model/up_sampling2d_1/mul",
        ],
        attr: {
          T: { type: "DT_FLOAT" },
          half_pixel_centers: { b: true },
          align_corners: { b: false },
        },
      },
      {
        name: "StatefulPartitionedCall/model/regressor_palm_16_NO_PRUNING/BiasAdd",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_22/Relu",
          "StatefulPartitionedCall/model/regressor_palm_16_NO_PRUNING/Conv2D/ReadVariableOp",
          "StatefulPartitionedCall/model/regressor_palm_16_NO_PRUNING/BiasAdd/ReadVariableOp",
        ],
        device: "/device:CPU:0",
        attr: {
          use_cudnn_on_gpu: { b: true },
          num_args: { i: "1" },
          padding: { s: "U0FNRQ==" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          data_format: { s: "TkhXQw==" },
          explicit_paddings: { list: {} },
          T: { type: "DT_FLOAT" },
          epsilon: { f: 0.0 },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/reshaped_classifier_palm_16/Shape",
        op: "Shape",
        input: [
          "StatefulPartitionedCall/model/classifier_palm_16_NO_PRUNING/BiasAdd",
        ],
        attr: { T: { type: "DT_FLOAT" }, out_type: { type: "DT_INT32" } },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_23/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/up_sampling2d_1/resize/ResizeBilinear",
          "StatefulPartitionedCall/model/conv2d_23/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_23/Conv2D_bn_offset",
          "StatefulPartitionedCall/model/p_re_lu_23/Neg",
        ],
        device: "/device:CPU:0",
        attr: {
          padding: { s: "VkFMSUQ=" },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          use_cudnn_on_gpu: { b: true },
          data_format: { s: "TkhXQw==" },
          T: { type: "DT_FLOAT" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          fused_ops: { list: { s: ["Qmlhc0FkZA==", "UHJlbHU="] } },
          explicit_paddings: { list: {} },
          num_args: { i: "2" },
          epsilon: { f: 0.0 },
        },
      },
      {
        name: "StatefulPartitionedCall/model/reshaped_regressor_palm_16/Shape",
        op: "Shape",
        input: [
          "StatefulPartitionedCall/model/regressor_palm_16_NO_PRUNING/BiasAdd",
        ],
        attr: { T: { type: "DT_FLOAT" }, out_type: { type: "DT_INT32" } },
      },
      {
        name: "StatefulPartitionedCall/model/reshaped_classifier_palm_16/strided_slice",
        op: "StridedSlice",
        input: [
          "StatefulPartitionedCall/model/reshaped_classifier_palm_16/Shape",
          "StatefulPartitionedCall/model/reshaped_classifier_palm_16/strided_slice/stack",
          "StatefulPartitionedCall/model/reshaped_classifier_palm_16/strided_slice/stack_1",
          "StatefulPartitionedCall/model/reshaped_classifier_palm_16/strided_slice/stack_2",
        ],
        attr: {
          Index: { type: "DT_INT32" },
          ellipsis_mask: { i: "0" },
          T: { type: "DT_INT32" },
          shrink_axis_mask: { i: "1" },
          end_mask: { i: "0" },
          begin_mask: { i: "0" },
          new_axis_mask: { i: "0" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/reshaped_regressor_palm_16/strided_slice",
        op: "StridedSlice",
        input: [
          "StatefulPartitionedCall/model/reshaped_regressor_palm_16/Shape",
          "StatefulPartitionedCall/model/reshaped_regressor_palm_16/strided_slice/stack",
          "StatefulPartitionedCall/model/reshaped_regressor_palm_16/strided_slice/stack_1",
          "StatefulPartitionedCall/model/reshaped_regressor_palm_16/strided_slice/stack_2",
        ],
        attr: {
          new_axis_mask: { i: "0" },
          T: { type: "DT_INT32" },
          end_mask: { i: "0" },
          shrink_axis_mask: { i: "1" },
          Index: { type: "DT_INT32" },
          ellipsis_mask: { i: "0" },
          begin_mask: { i: "0" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/reshaped_classifier_palm_16/Reshape/shape",
        op: "Pack",
        input: [
          "StatefulPartitionedCall/model/reshaped_classifier_palm_16/strided_slice",
          "StatefulPartitionedCall/model/reshaped_classifier_palm_16/Reshape/shape/1",
          "StatefulPartitionedCall/model/reshaped_classifier_palm_16/Reshape/shape/2",
        ],
        attr: { T: { type: "DT_INT32" }, N: { i: "3" }, axis: { i: "0" } },
      },
      {
        name: "StatefulPartitionedCall/model/reshaped_regressor_palm_16/Reshape/shape",
        op: "Pack",
        input: [
          "StatefulPartitionedCall/model/reshaped_regressor_palm_16/strided_slice",
          "StatefulPartitionedCall/model/reshaped_regressor_palm_16/Reshape/shape/1",
          "StatefulPartitionedCall/model/reshaped_regressor_palm_16/Reshape/shape/2",
        ],
        attr: { T: { type: "DT_INT32" }, N: { i: "3" }, axis: { i: "0" } },
      },
      {
        name: "StatefulPartitionedCall/model/reshaped_classifier_palm_16/Reshape",
        op: "Reshape",
        input: [
          "StatefulPartitionedCall/model/classifier_palm_16_NO_PRUNING/BiasAdd",
          "StatefulPartitionedCall/model/reshaped_classifier_palm_16/Reshape/shape",
        ],
        attr: { Tshape: { type: "DT_INT32" }, T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/reshaped_regressor_palm_16/Reshape",
        op: "Reshape",
        input: [
          "StatefulPartitionedCall/model/regressor_palm_16_NO_PRUNING/BiasAdd",
          "StatefulPartitionedCall/model/reshaped_regressor_palm_16/Reshape/shape",
        ],
        attr: { Tshape: { type: "DT_INT32" }, T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/add_22/add",
        op: "AddV2",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_11/Relu",
          "StatefulPartitionedCall/model/batch_normalization_23/FusedBatchNormV3",
        ],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_21/depthwise",
        op: "DepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/add_22/add",
          "StatefulPartitionedCall/model/depthwise_conv2d_21/depthwise/ReadVariableOp",
        ],
        attr: {
          T: { type: "DT_FLOAT" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          padding: { s: "U0FNRQ==" },
          explicit_paddings: { list: {} },
          data_format: { s: "TkhXQw==" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_24/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d_21/depthwise",
          "StatefulPartitionedCall/model/conv2d_24/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_24/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          explicit_paddings: { list: {} },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          epsilon: { f: 0.0 },
          use_cudnn_on_gpu: { b: true },
          padding: { s: "VkFMSUQ=" },
          data_format: { s: "TkhXQw==" },
          num_args: { i: "1" },
          T: { type: "DT_FLOAT" },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
        },
      },
      {
        name: "StatefulPartitionedCall/model/add_23/add",
        op: "AddV2",
        input: [
          "StatefulPartitionedCall/model/add_22/add",
          "StatefulPartitionedCall/model/batch_normalization_24/FusedBatchNormV3",
        ],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_24/Relu",
        op: "Prelu",
        input: [
          "StatefulPartitionedCall/model/add_23/add",
          "StatefulPartitionedCall/model/p_re_lu_24/Neg",
        ],
      },
      {
        name: "StatefulPartitionedCall/model/depthwise_conv2d_22/depthwise",
        op: "DepthwiseConv2dNative",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_24/Relu",
          "StatefulPartitionedCall/model/depthwise_conv2d_22/depthwise/ReadVariableOp",
        ],
        attr: {
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          padding: { s: "U0FNRQ==" },
          explicit_paddings: { list: {} },
          data_format: { s: "TkhXQw==" },
          T: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/batch_normalization_25/FusedBatchNormV3",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/depthwise_conv2d_22/depthwise",
          "StatefulPartitionedCall/model/conv2d_25/Conv2D_weights",
          "StatefulPartitionedCall/model/conv2d_25/Conv2D_bn_offset",
        ],
        device: "/device:CPU:0",
        attr: {
          epsilon: { f: 0.0 },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          T: { type: "DT_FLOAT" },
          explicit_paddings: { list: {} },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          data_format: { s: "TkhXQw==" },
          num_args: { i: "1" },
          padding: { s: "VkFMSUQ=" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          use_cudnn_on_gpu: { b: true },
        },
      },
      {
        name: "StatefulPartitionedCall/model/add_24/add",
        op: "AddV2",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_24/Relu",
          "StatefulPartitionedCall/model/batch_normalization_25/FusedBatchNormV3",
        ],
        attr: { T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/p_re_lu_25/Relu",
        op: "Prelu",
        input: [
          "StatefulPartitionedCall/model/add_24/add",
          "StatefulPartitionedCall/model/p_re_lu_25/Neg",
        ],
      },
      {
        name: "StatefulPartitionedCall/model/classifier_palm_8_NO_PRUNING/BiasAdd",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_25/Relu",
          "StatefulPartitionedCall/model/classifier_palm_8_NO_PRUNING/Conv2D/ReadVariableOp",
          "StatefulPartitionedCall/model/classifier_palm_8_NO_PRUNING/BiasAdd/ReadVariableOp",
        ],
        device: "/device:CPU:0",
        attr: {
          epsilon: { f: 0.0 },
          padding: { s: "U0FNRQ==" },
          num_args: { i: "1" },
          T: { type: "DT_FLOAT" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          data_format: { s: "TkhXQw==" },
          explicit_paddings: { list: {} },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          use_cudnn_on_gpu: { b: true },
        },
      },
      {
        name: "StatefulPartitionedCall/model/regressor_palm_8_NO_PRUNING/BiasAdd",
        op: "_FusedConv2D",
        input: [
          "StatefulPartitionedCall/model/p_re_lu_25/Relu",
          "StatefulPartitionedCall/model/regressor_palm_8_NO_PRUNING/Conv2D/ReadVariableOp",
          "StatefulPartitionedCall/model/regressor_palm_8_NO_PRUNING/BiasAdd/ReadVariableOp",
        ],
        device: "/device:CPU:0",
        attr: {
          T: { type: "DT_FLOAT" },
          num_args: { i: "1" },
          padding: { s: "U0FNRQ==" },
          use_cudnn_on_gpu: { b: true },
          explicit_paddings: { list: {} },
          dilations: { list: { i: ["1", "1", "1", "1"] } },
          data_format: { s: "TkhXQw==" },
          strides: { list: { i: ["1", "1", "1", "1"] } },
          fused_ops: { list: { s: ["Qmlhc0FkZA=="] } },
          epsilon: { f: 0.0 },
        },
      },
      {
        name: "StatefulPartitionedCall/model/reshaped_classifier_palm_8/Shape",
        op: "Shape",
        input: [
          "StatefulPartitionedCall/model/classifier_palm_8_NO_PRUNING/BiasAdd",
        ],
        attr: { T: { type: "DT_FLOAT" }, out_type: { type: "DT_INT32" } },
      },
      {
        name: "StatefulPartitionedCall/model/reshaped_regressor_palm_8/Shape",
        op: "Shape",
        input: [
          "StatefulPartitionedCall/model/regressor_palm_8_NO_PRUNING/BiasAdd",
        ],
        attr: { T: { type: "DT_FLOAT" }, out_type: { type: "DT_INT32" } },
      },
      {
        name: "StatefulPartitionedCall/model/reshaped_classifier_palm_8/strided_slice",
        op: "StridedSlice",
        input: [
          "StatefulPartitionedCall/model/reshaped_classifier_palm_8/Shape",
          "StatefulPartitionedCall/model/reshaped_classifier_palm_8/strided_slice/stack",
          "StatefulPartitionedCall/model/reshaped_classifier_palm_8/strided_slice/stack_1",
          "StatefulPartitionedCall/model/reshaped_classifier_palm_8/strided_slice/stack_2",
        ],
        attr: {
          T: { type: "DT_INT32" },
          shrink_axis_mask: { i: "1" },
          ellipsis_mask: { i: "0" },
          end_mask: { i: "0" },
          new_axis_mask: { i: "0" },
          Index: { type: "DT_INT32" },
          begin_mask: { i: "0" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/reshaped_regressor_palm_8/strided_slice",
        op: "StridedSlice",
        input: [
          "StatefulPartitionedCall/model/reshaped_regressor_palm_8/Shape",
          "StatefulPartitionedCall/model/reshaped_regressor_palm_8/strided_slice/stack",
          "StatefulPartitionedCall/model/reshaped_regressor_palm_8/strided_slice/stack_1",
          "StatefulPartitionedCall/model/reshaped_regressor_palm_8/strided_slice/stack_2",
        ],
        attr: {
          ellipsis_mask: { i: "0" },
          shrink_axis_mask: { i: "1" },
          Index: { type: "DT_INT32" },
          begin_mask: { i: "0" },
          end_mask: { i: "0" },
          T: { type: "DT_INT32" },
          new_axis_mask: { i: "0" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/reshaped_classifier_palm_8/Reshape/shape",
        op: "Pack",
        input: [
          "StatefulPartitionedCall/model/reshaped_classifier_palm_8/strided_slice",
          "StatefulPartitionedCall/model/reshaped_classifier_palm_8/Reshape/shape/1",
          "StatefulPartitionedCall/model/reshaped_classifier_palm_8/Reshape/shape/2",
        ],
        attr: { T: { type: "DT_INT32" }, N: { i: "3" }, axis: { i: "0" } },
      },
      {
        name: "StatefulPartitionedCall/model/reshaped_regressor_palm_8/Reshape/shape",
        op: "Pack",
        input: [
          "StatefulPartitionedCall/model/reshaped_regressor_palm_8/strided_slice",
          "StatefulPartitionedCall/model/reshaped_regressor_palm_8/Reshape/shape/1",
          "StatefulPartitionedCall/model/reshaped_regressor_palm_8/Reshape/shape/2",
        ],
        attr: { T: { type: "DT_INT32" }, axis: { i: "0" }, N: { i: "3" } },
      },
      {
        name: "StatefulPartitionedCall/model/reshaped_classifier_palm_8/Reshape",
        op: "Reshape",
        input: [
          "StatefulPartitionedCall/model/classifier_palm_8_NO_PRUNING/BiasAdd",
          "StatefulPartitionedCall/model/reshaped_classifier_palm_8/Reshape/shape",
        ],
        attr: { Tshape: { type: "DT_INT32" }, T: { type: "DT_FLOAT" } },
      },
      {
        name: "StatefulPartitionedCall/model/reshaped_regressor_palm_8/Reshape",
        op: "Reshape",
        input: [
          "StatefulPartitionedCall/model/regressor_palm_8_NO_PRUNING/BiasAdd",
          "StatefulPartitionedCall/model/reshaped_regressor_palm_8/Reshape/shape",
        ],
        attr: { T: { type: "DT_FLOAT" }, Tshape: { type: "DT_INT32" } },
      },
      {
        name: "StatefulPartitionedCall/model/classifiers_palm/concat",
        op: "ConcatV2",
        input: [
          "StatefulPartitionedCall/model/reshaped_classifier_palm_8/Reshape",
          "StatefulPartitionedCall/model/reshaped_classifier_palm_16/Reshape",
          "StatefulPartitionedCall/model/classifiers_palm/concat/axis",
        ],
        attr: {
          N: { i: "2" },
          Tidx: { type: "DT_INT32" },
          T: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/regressors_palm/concat",
        op: "ConcatV2",
        input: [
          "StatefulPartitionedCall/model/reshaped_regressor_palm_8/Reshape",
          "StatefulPartitionedCall/model/reshaped_regressor_palm_16/Reshape",
          "StatefulPartitionedCall/model/regressors_palm/concat/axis",
        ],
        attr: {
          N: { i: "2" },
          Tidx: { type: "DT_INT32" },
          T: { type: "DT_FLOAT" },
        },
      },
      {
        name: "StatefulPartitionedCall/model/palm/concat",
        op: "ConcatV2",
        input: [
          "StatefulPartitionedCall/model/classifiers_palm/concat",
          "StatefulPartitionedCall/model/regressors_palm/concat",
          "StatefulPartitionedCall/model/palm/concat/axis",
        ],
        attr: {
          T: { type: "DT_FLOAT" },
          Tidx: { type: "DT_INT32" },
          N: { i: "2" },
        },
      },
      {
        name: "Identity",
        op: "Identity",
        input: ["StatefulPartitionedCall/model/palm/concat"],
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
          name: "StatefulPartitionedCall/model/classifier_palm_8_NO_PRUNING/Conv2D/ReadVariableOp",
          shape: [1, 1, 128, 2],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/classifier_palm_8_NO_PRUNING/BiasAdd/ReadVariableOp",
          shape: [2],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/reshaped_classifier_palm_8/strided_slice/stack",
          shape: [1],
          dtype: "int32",
        },
        {
          name: "StatefulPartitionedCall/model/reshaped_classifier_palm_8/strided_slice/stack_1",
          shape: [1],
          dtype: "int32",
        },
        {
          name: "StatefulPartitionedCall/model/reshaped_classifier_palm_8/strided_slice/stack_2",
          shape: [1],
          dtype: "int32",
        },
        {
          name: "StatefulPartitionedCall/model/reshaped_classifier_palm_8/Reshape/shape/1",
          shape: [],
          dtype: "int32",
        },
        {
          name: "StatefulPartitionedCall/model/reshaped_classifier_palm_8/Reshape/shape/2",
          shape: [],
          dtype: "int32",
        },
        {
          name: "StatefulPartitionedCall/model/classifier_palm_16_NO_PRUNING/Conv2D/ReadVariableOp",
          shape: [1, 1, 256, 6],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/classifier_palm_16_NO_PRUNING/BiasAdd/ReadVariableOp",
          shape: [6],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/reshaped_classifier_palm_16/strided_slice/stack",
          shape: [1],
          dtype: "int32",
        },
        {
          name: "StatefulPartitionedCall/model/reshaped_classifier_palm_16/strided_slice/stack_1",
          shape: [1],
          dtype: "int32",
        },
        {
          name: "StatefulPartitionedCall/model/reshaped_classifier_palm_16/strided_slice/stack_2",
          shape: [1],
          dtype: "int32",
        },
        {
          name: "StatefulPartitionedCall/model/reshaped_classifier_palm_16/Reshape/shape/1",
          shape: [],
          dtype: "int32",
        },
        {
          name: "StatefulPartitionedCall/model/reshaped_classifier_palm_16/Reshape/shape/2",
          shape: [],
          dtype: "int32",
        },
        {
          name: "StatefulPartitionedCall/model/classifiers_palm/concat/axis",
          shape: [],
          dtype: "int32",
        },
        {
          name: "StatefulPartitionedCall/model/p_re_lu_25/Neg",
          shape: [1, 1, 128],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/p_re_lu_24/Neg",
          shape: [1, 1, 128],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/p_re_lu_23/Neg",
          shape: [1, 1, 128],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/up_sampling2d_1/mul",
          shape: [2],
          dtype: "int32",
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_21/depthwise/ReadVariableOp",
          shape: [5, 5, 128, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_22/depthwise/ReadVariableOp",
          shape: [5, 5, 128, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/regressor_palm_8_NO_PRUNING/Conv2D/ReadVariableOp",
          shape: [1, 1, 128, 36],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/regressor_palm_8_NO_PRUNING/BiasAdd/ReadVariableOp",
          shape: [36],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/reshaped_regressor_palm_8/strided_slice/stack",
          shape: [1],
          dtype: "int32",
        },
        {
          name: "StatefulPartitionedCall/model/reshaped_regressor_palm_8/strided_slice/stack_1",
          shape: [1],
          dtype: "int32",
        },
        {
          name: "StatefulPartitionedCall/model/reshaped_regressor_palm_8/strided_slice/stack_2",
          shape: [1],
          dtype: "int32",
        },
        {
          name: "StatefulPartitionedCall/model/reshaped_regressor_palm_8/Reshape/shape/1",
          shape: [],
          dtype: "int32",
        },
        {
          name: "StatefulPartitionedCall/model/reshaped_regressor_palm_8/Reshape/shape/2",
          shape: [],
          dtype: "int32",
        },
        {
          name: "StatefulPartitionedCall/model/p_re_lu_22/Neg",
          shape: [1, 1, 256],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/p_re_lu_21/Neg",
          shape: [1, 1, 256],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/p_re_lu_20/Neg",
          shape: [1, 1, 256],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/p_re_lu_19/Neg",
          shape: [1, 1, 256],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/p_re_lu_18/Neg",
          shape: [1, 1, 256],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/p_re_lu_17/Neg",
          shape: [1, 1, 256],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/p_re_lu_16/Neg",
          shape: [1, 1, 256],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/p_re_lu_15/Neg",
          shape: [1, 1, 256],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/p_re_lu_14/Neg",
          shape: [1, 1, 256],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/p_re_lu_13/Neg",
          shape: [1, 1, 256],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/p_re_lu_12/Neg",
          shape: [1, 1, 256],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/channel_padding_2/Pad/paddings",
          shape: [4, 2],
          dtype: "int32",
        },
        {
          name: "StatefulPartitionedCall/model/p_re_lu_11/Neg",
          shape: [1, 1, 128],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/p_re_lu_10/Neg",
          shape: [1, 1, 128],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/p_re_lu_9/Neg",
          shape: [1, 1, 128],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/p_re_lu_8/Neg",
          shape: [1, 1, 128],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/channel_padding_1/Pad/paddings",
          shape: [4, 2],
          dtype: "int32",
        },
        {
          name: "StatefulPartitionedCall/model/p_re_lu_7/Neg",
          shape: [1, 1, 64],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/p_re_lu_6/Neg",
          shape: [1, 1, 64],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/p_re_lu_5/Neg",
          shape: [1, 1, 64],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/p_re_lu_4/Neg",
          shape: [1, 1, 64],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/channel_padding/Pad/paddings",
          shape: [4, 2],
          dtype: "int32",
        },
        {
          name: "StatefulPartitionedCall/model/p_re_lu_3/Neg",
          shape: [1, 1, 32],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/p_re_lu_2/Neg",
          shape: [1, 1, 32],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/p_re_lu_1/Neg",
          shape: [1, 1, 32],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/p_re_lu/Neg",
          shape: [1, 1, 32],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d/depthwise/ReadVariableOp",
          shape: [5, 5, 32, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_1/depthwise/ReadVariableOp",
          shape: [5, 5, 32, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_2/depthwise/ReadVariableOp",
          shape: [5, 5, 32, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_3/depthwise/ReadVariableOp",
          shape: [5, 5, 32, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_4/depthwise/ReadVariableOp",
          shape: [5, 5, 64, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_5/depthwise/ReadVariableOp",
          shape: [5, 5, 64, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_6/depthwise/ReadVariableOp",
          shape: [5, 5, 64, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_7/depthwise/ReadVariableOp",
          shape: [5, 5, 64, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_8/depthwise/ReadVariableOp",
          shape: [5, 5, 128, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_9/depthwise/ReadVariableOp",
          shape: [5, 5, 128, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_10/depthwise/ReadVariableOp",
          shape: [5, 5, 128, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_11/depthwise/ReadVariableOp",
          shape: [5, 5, 128, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_12/depthwise/ReadVariableOp",
          shape: [5, 5, 256, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_13/depthwise/ReadVariableOp",
          shape: [5, 5, 256, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_14/depthwise/ReadVariableOp",
          shape: [5, 5, 256, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_15/depthwise/ReadVariableOp",
          shape: [5, 5, 256, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_16/depthwise/ReadVariableOp",
          shape: [5, 5, 256, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_17/depthwise/ReadVariableOp",
          shape: [5, 5, 256, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_18/depthwise/ReadVariableOp",
          shape: [5, 5, 256, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/up_sampling2d/mul",
          shape: [2],
          dtype: "int32",
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_19/depthwise/ReadVariableOp",
          shape: [5, 5, 256, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/depthwise_conv2d_20/depthwise/ReadVariableOp",
          shape: [5, 5, 256, 1],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/regressor_palm_16_NO_PRUNING/Conv2D/ReadVariableOp",
          shape: [1, 1, 256, 108],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/regressor_palm_16_NO_PRUNING/BiasAdd/ReadVariableOp",
          shape: [108],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/reshaped_regressor_palm_16/strided_slice/stack",
          shape: [1],
          dtype: "int32",
        },
        {
          name: "StatefulPartitionedCall/model/reshaped_regressor_palm_16/strided_slice/stack_1",
          shape: [1],
          dtype: "int32",
        },
        {
          name: "StatefulPartitionedCall/model/reshaped_regressor_palm_16/strided_slice/stack_2",
          shape: [1],
          dtype: "int32",
        },
        {
          name: "StatefulPartitionedCall/model/reshaped_regressor_palm_16/Reshape/shape/1",
          shape: [],
          dtype: "int32",
        },
        {
          name: "StatefulPartitionedCall/model/reshaped_regressor_palm_16/Reshape/shape/2",
          shape: [],
          dtype: "int32",
        },
        {
          name: "StatefulPartitionedCall/model/regressors_palm/concat/axis",
          shape: [],
          dtype: "int32",
        },
        {
          name: "StatefulPartitionedCall/model/palm/concat/axis",
          shape: [],
          dtype: "int32",
        },
        {
          name: "StatefulPartitionedCall/model/conv2d/Conv2D_weights",
          shape: [5, 5, 3, 32],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d/Conv2D_bn_offset",
          shape: [32],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_1/Conv2D_weights",
          shape: [1, 1, 32, 32],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_1/Conv2D_bn_offset",
          shape: [32],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_2/Conv2D_weights",
          shape: [1, 1, 32, 32],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_2/Conv2D_bn_offset",
          shape: [32],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_3/Conv2D_weights",
          shape: [1, 1, 32, 32],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_3/Conv2D_bn_offset",
          shape: [32],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_4/Conv2D_weights",
          shape: [1, 1, 32, 64],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_25/Conv2D_weights",
          shape: [1, 1, 128, 128],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_4/Conv2D_bn_offset",
          shape: [64],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_5/Conv2D_weights",
          shape: [1, 1, 64, 64],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_5/Conv2D_bn_offset",
          shape: [64],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_6/Conv2D_weights",
          shape: [1, 1, 64, 64],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_25/Conv2D_bn_offset",
          shape: [128],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_6/Conv2D_bn_offset",
          shape: [64],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_7/Conv2D_weights",
          shape: [1, 1, 64, 64],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_7/Conv2D_bn_offset",
          shape: [64],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_8/Conv2D_weights",
          shape: [1, 1, 64, 128],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_8/Conv2D_bn_offset",
          shape: [128],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_9/Conv2D_weights",
          shape: [1, 1, 128, 128],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_9/Conv2D_bn_offset",
          shape: [128],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_10/Conv2D_weights",
          shape: [1, 1, 128, 128],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_10/Conv2D_bn_offset",
          shape: [128],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_11/Conv2D_weights",
          shape: [1, 1, 128, 128],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_11/Conv2D_bn_offset",
          shape: [128],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_12/Conv2D_weights",
          shape: [1, 1, 128, 256],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_12/Conv2D_bn_offset",
          shape: [256],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_13/Conv2D_weights",
          shape: [1, 1, 256, 256],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_13/Conv2D_bn_offset",
          shape: [256],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_14/Conv2D_weights",
          shape: [1, 1, 256, 256],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_14/Conv2D_bn_offset",
          shape: [256],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_15/Conv2D_weights",
          shape: [1, 1, 256, 256],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_15/Conv2D_bn_offset",
          shape: [256],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_16/Conv2D_weights",
          shape: [1, 1, 256, 256],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_16/Conv2D_bn_offset",
          shape: [256],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_17/Conv2D_weights",
          shape: [1, 1, 256, 256],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_17/Conv2D_bn_offset",
          shape: [256],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_18/Conv2D_weights",
          shape: [1, 1, 256, 256],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_18/Conv2D_bn_offset",
          shape: [256],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_19/Conv2D_weights",
          shape: [1, 1, 256, 256],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_19/Conv2D_bn_offset",
          shape: [256],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_20/Conv2D_weights",
          shape: [1, 1, 256, 256],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_20/Conv2D_bn_offset",
          shape: [256],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_21/Conv2D_weights",
          shape: [1, 1, 256, 256],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_21/Conv2D_bn_offset",
          shape: [256],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_22/Conv2D_weights",
          shape: [1, 1, 256, 256],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_22/Conv2D_bn_offset",
          shape: [256],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_23/Conv2D_weights",
          shape: [1, 1, 256, 128],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_23/Conv2D_bn_offset",
          shape: [128],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_24/Conv2D_weights",
          shape: [1, 1, 128, 128],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
        {
          name: "StatefulPartitionedCall/model/conv2d_24/Conv2D_bn_offset",
          shape: [128],
          dtype: "float32",
          quantization: { dtype: "float16", original_dtype: "float32" },
        },
      ],
    },
  ],
};

export default modelJson;
