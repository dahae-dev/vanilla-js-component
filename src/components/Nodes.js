export default function Nodes({
  $app,
  initialState = { isRoot: false, nodes: [] },
  onClick,
  onPrevious,
}) {
  this.state = initialState;
  this.onClick = onClick;
  this.onPrevious = onPrevious;

  this.$element = document.createElement('div');
  this.$element.className = 'Nodes';
  $app.appendChild(this.$element);

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  }

  this.render = () => {
    if (this.state.nodes) {
      const nodesTemplate = this.state.nodes.map((node) => {
        const iconPath = (
          node.type === 'FILE'
            ? './assets/file.png'
            : './assets/directory.png'
        );

        return `
          <div class="Node" data-node-id="${node.id}">
            <img src="${iconPath}" />
            <div>${node.name}</div>
          </div>
        `
      }).join('');

      this.$element.innerHTML = (
        this.state.isRoot
          ? nodesTemplate
          : `
            <div class="Node">
              <img src="./assets/prev.png" />
              ${nodesTemplate}
            </div>
          `
      )
    }
  }

  this.$element.addEventListener('click', (e) => {
    const $node = e.target.closest('.Node');
    if ($node) {
      const { nodeId } = $node.dataset;

      if (!nodeId) {
        this.onPrevious();
        return;
      }

      const selectedNode = this.state.nodes.find((node) => node.id === nodeId);
      if (selectedNode) {
        this.onClick(selectedNode);
      }
    }
  })
}