const IMG_PATH_PREFIX = 'https://fe-dev-matching-2021-03-serverlessdeploymentbuck-t3kpj3way537.s3.ap-northeast-2.amazonaws.com/public';

export default function ImageViewer({ $app, initialState = { imgPath: '' } }) {
  this.state = initialState;

  this.$element = document.createElement('div');
  this.$element.className = 'Modal ImageViewer';
  $app.appendChild(this.$element);

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  }

  this.render = () => {
    this.$element.innerHTML = `
      <div class="content">
        <img src="${this.state.filePath ? `${IMG_PATH_PREFIX}${this.state.filePath}` : "./assets/sample.jpeg"}" />
      </div >
    `;

    this.$element.style.display = this.state.imgPath ? 'block' : 'none';
  }

  this.$element.addEventListener('click', (e) => {
    const $content = this.$element.querySelector('.content');
    if (e.target !== $content) {
      this.$element.style.display = 'none';
    }
  })
}