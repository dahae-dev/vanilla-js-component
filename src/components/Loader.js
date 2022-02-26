export default function Loader({ $app, initialState = { isLoading: false } }) {
  this.state = initialState;

  this.$element = document.createElement('div');
  this.$element.className = 'Modal Loader';
  $app.appendChild(this.$element);

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  }

  this.render = () => {
    this.$element.innerHTML = `
      <div class="Loader__wrapper content">
          <img src="./assets/nyan-cat.gif" width="300" />
      </div>
    `;

    this.$element.style.display = (
      this.state.isLoading
        ? 'block'
        : 'none'
    )
  }
}