export default function Breadcrumb({ $app, initialState = { nodes: [] }, onClick }) {
  this.state = initialState;
  this.onClick = onClick;

  this.$element = document.createElement('nav');
  this.$element.className = 'Breadcrumb';
  $app.appendChild(this.$element);

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  }

  this.render = () => {
    this.$element.innerHTML = `
      <div class="Breadcrumb__item">root</div>${this.state.nodes.map((node, index) => `
          <div class="Breadcrumb__item" data-index="${index}">${node.name}</div>
        `).join('')
      }
    `;
  }

  this.$element.addEventListener('click', (e) => {
    const $item = e.target.closest('.Breadcrumb__item');

    if ($item) {
      const { index } = $item.dataset;
      this.onClick(index ? parseInt(index, 10) : null);
    }
  })
}