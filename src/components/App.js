import Breadcrumb from './Breadcrumb.js';
import ImageViewer from './ImageViewer.js';
import Loader from './Loader.js';
import Nodes from './Nodes.js';
import { request } from '../services/api.js'

const cache = {};

export default function App($app) {
  this.state = {
    isRoot: false,
    isLoading: false,
    nodes: [],
    depth: [],
    selectedFilePath: '',
  }

  const breadcrumb = new Breadcrumb({
    $app,
    initialState: {
      nodes: this.state.depth,
    },
    onClick: (index) => {
      if (index === null) {
        this.setState({
          ...this.state,
          depth: [],
          nodes: cache.root,
          isRoot: true,
          selectedFilePath: '',
        })
        return;
      }

      if (index === this.state.depth.length - 1) {
        return;
      }

      const nextState = { ...this.state };
      const newDepth = this.state.depth.slice(0, index + 1);
      this.setState({
        ...nextState,
        depth: newDepth,
        nodes: cache[newDepth[newDepth.length - 1].id],
      })
    }
  })

  const nodes = new Nodes({
    $app,
    initialState: {
      isRoot: this.state.isRoot,
      nodes: this.state.nodes,
    },
    onClick: async (node) => {
      try {
        if (node.type === 'DIRECTORY') {
          if (cache[node.id]) {
            this.setState({
              ...this.state,
              nodes: cache[node.id],
              depth: [...this.state.depth, node],
              isRoot: false,
              selectedFilePath: '',
            })
          } else {
            this.setState({
              ...this.state,
              isLoading: true,
              selectedFilePath: '',
            });
            const newNodes = await request(node.id);
            this.setState({
              ...this.state,
              nodes: newNodes,
              depth: [...this.state.depth, node],
              isRoot: false,
              isLoading: false,
            })
            cache[node.id] = newNodes;
          }
        } else if (node.type === 'FILE') {
          this.setState({
            ...this.state,
            selectedFilePath: node.filePath,
          })
        }
      } catch (err) {
        console.log(err);
      }
    },
    onPrevious: async () => {
      try {
        const nextState = { ...this.state };
        nextState.depth.pop();

        const prevNodeId = (
          nextState.depth.length === 0
            ? null
            : nextState.depth[nextState.depth.length - 1].id
        )

        if (prevNodeId === null) {
          this.setState({
            ...nextState,
            isRoot: true,
            nodes: cache.root,
          })
        } else {
          this.setState({
            ...nextState,
            isRoot: false,
            nodes: cache[prevNodeId],
          })
        }
      } catch (err) {
        console.log(err);
      }
    },
  })

  const imageViewer = new ImageViewer({
    $app,
    initialState: {
      imgPath: this.state.selectedFilePath,
    },
  })

  const loader = new Loader({
    $app,
    initialState: {
      isLoading: this.state.isLoading,
    }
  })

  this.setState = (nextState) => {
    this.state = nextState;
    breadcrumb.setState({
      nodes: this.state.depth,
    });
    nodes.setState({
      isRoot: this.state.isRoot,
      nodes: this.state.nodes,
    });
    imageViewer.setState({
      imgPath: this.state.selectedFilePath,
    });
    loader.setState({
      isLoading: this.state.isLoading,
    });
  }

  const init = async () => {
    try {
      this.setState({
        ...this.state,
        isLoading: true,
      });

      const rootNodes = await request();
      this.setState({
        ...this.state,
        isRoot: true,
        nodes: rootNodes,
      })

      cache.root = rootNodes;
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({
        ...this.state,
        isLoading: false,
      })
    }
  }

  init();
}