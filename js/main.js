
const Main = {

  init: function() { // init não é nome reservado || responsável por inicar os seletores
    this.cacheSelectors() // this. é para referenciar que o cacheSelectors é do pai, no caso o Main
    this.bindEvents() // adiciona os eventos
  },

  cacheSelectors: function() { //cacheSelectors não é nome reservado || Será responsável por selecionar os elementos do HTML e armazenar eles em variável
    this.checkButtons = document.querySelectorAll('.check') //o this. está colocando a variável no Main, disponível para todas as funções || se utilizasse let ao invés de this, a variável ficaria presa dentro desta função

  },

  bindEvents: function() { // bindEvents não é um nome reservado || responsável por adicionar eventos, onclick por exemplo
    const self = this // hack para o this continuar sendo do Main e não do Window

    this.checkButtons.forEach(function(button){ // percorre todos os checkButtons e executa a função button para cada um deles
      button.onclick = self.Events.checkButton_click //self é this que é Main, Events, checkButton_click vem de Events
    })

  },



  Events: { //aqui vai ficar as funções dos eventos
    checkButton_click: function() {
      alert('ok')
    }
  }

}

Main.init() // executa o Main para funcionar a aplicação