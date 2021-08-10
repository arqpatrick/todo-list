
const Main = {

  init: function() { // init não é nome reservado || responsável por inicar os seletores
    this.cacheSelectors() // this. é para referenciar que o cacheSelectors é do pai, no caso o Main
    this.bindEvents() // adiciona os eventos
  },

  cacheSelectors: function() { //cacheSelectors não é nome reservado || Será responsável por selecionar os elementos do HTML e armazenar eles em variável
    this.$checkButtons = document.querySelectorAll('.check') //o this. está colocando a variável no Main, disponível para todas as funções || se utilizasse let ao invés de this, a variável ficaria presa dentro desta função
    this.$inputTask = document.querySelector('#inputTask') // seleciona o que for escrito no input inputTask
    this.$list = document.querySelector('#list') // seleciona o ul list
    this.$removeButtons = document.querySelectorAll('.remove') // percorre todos os botões de remove
  },

  bindEvents: function() { // bindEvents não é um nome reservado || responsável por adicionar eventos, onclick por exemplo
    const self = this // hack para o this continuar sendo do Main e não do Window

    this.$checkButtons.forEach(function(button){ // percorre todos os checkButtons e executa a função button para cada um deles
      button.onclick = self.Events.checkButton_click //self é this que é Main, Events, checkButton_click vem de Events
    })

    this.$inputTask.onkeypress = self.Events.inputTask_keypress.bind(self) //bind(this) ou bind(self) é para utilizar o this do Main. Isso sempre ocorre quando estamos dentro de um evento

    this.$removeButtons.forEach(function(button){
      button.onclick = self.Events.removeButton_click
    })
  },



  Events: { //aqui vai ficar as funções dos eventos
    checkButton_click: function(e) { // e = evento
      const li = e.target.parentElement // chegar na (li class) do (ul list) da (section wrapper-list) para atribuir done a ela
      const isDone = li.classList.contains('done') // contains checa se ('done') existe dentro de (li)

      // // ---- assim é a forma esmiuçada ----
      // if (isDone) {
      //   li.classList.remove('done') // se clicar na tarefa e ela estiver feita, remove a conclusão
      // } else {
      //   li.classList.add('done') // se clicar na tarefa e ela não estiver feita, marca como concluída
      // }
      // // ---- assim é a forma esmiuçada ----

      // ---- assim é a forma de acordo com boas práticas, pois elimina o else, e busca primeira a negativa !
      if (!isDone) {
        return li.classList.add('done') // se não for done (!isDone), retorna concluido
      }
      li.classList.remove('done') // senão remove concluido
      // ---- assim é a forma de acordo com boas práticas, pois elimina o else, e busca primeira a negativa !
    },

    inputTask_keypress: function(e) {
      const key = e.key
      const value = e.target.value

      if (key === 'Enter') {
        this.$list.innerHTML += `
          <li>
            <div class="check"></div>
            <label for="" class="task">
              ${value}
            </label>
            <button class="remove"></button>
          </li>
        `
        
        e.target.value = '' // para "limpar" o input depois de dar entrada

        //essa função fez com que o HTML perdesse os inputs e referencias
        //para solucionar isso, devemos executar novamente o cacheSelector e o bindEvents
        //para eles adicionarem as referencias novamente

        this.cacheSelectors()
        this.bindEvents()

      }
    },

    removeButton_click: function(e) {
      let li = e.target.parentElement

      li.classList.add('remove')

      setTimeout(function(){
        li.classList.add('hidden')
      },300)
    }
  }

}

Main.init() // executa o Main para funcionar a aplicação