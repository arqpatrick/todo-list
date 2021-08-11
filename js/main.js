
const Main = {

  tasks: [], //iniciar o tasks

  init: function() { // init não é nome reservado || responsável por inicar os seletores
    this.cacheSelectors() // this. é para referenciar que o cacheSelectors é do pai, no caso o Main
    this.bindEvents() // adiciona os eventos
    this.getStoraged() // para obter tudo que está armazenado já quando carregar a página
    this.buildTasks() // método que lista as tasks existentes no local storage
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
      button.onclick = self.Events.checkButton_click.bind(self) //self é this que é Main, Events, checkButton_click vem de Events
    })

    this.$inputTask.onkeypress = self.Events.inputTask_keypress.bind(self) //bind(this) ou bind(self) é para utilizar o this do Main. Isso sempre ocorre quando estamos dentro de um evento

    this.$removeButtons.forEach(function(button){
      button.onclick = self.Events.removeButton_click.bind(self)
    })
  },

  getStoraged: function() { //responsável por fazer o tasks e armazenar em um array
    const tasks = localStorage.getItem('tasks')

    if (tasks) { // if para checar caso ainda não tenha nada no localStorage, criando um array vazio nesse caso
      this.tasks = JSON.parse(tasks)
    } else {
      localStorage.setItem('tasks', JSON.stringify([]))
    }
  },
    //this.tasks é refernte ao tasks declarado lá em cima, o tasks do Main. 
    //Já o segundo tasks é o const tasks dessa function
    //Ele armazena os tasks lá no tasks do Main já transformando em array atraves do JSON.parse
  

  /**
   * como o esqueleto HTML responsável por criar a lista de tarefas está sendo utilizado em multiplos locais:
   * 
     this.tasks.forEach(item => {
      html +=
   * 
   * e
   * 
     if (key === 'Enter') {
        this.$list.innerHTML +=
   * 
   * 
   * vamos criar uma variável única para utilizar esse HTML - evitando problemas e facilitando a manutenção do código
   * 
   * getTaskHtml que retornará uma string
   * 
   */

  getTaskHtml: function(task, isDone) {
    return `
      <li class="${isDone ? 'done' : ''}" data-task="${task}">
        <div class="check"></div>
        <label class="task">
          ${task} 
        </label>
        <button class="remove"></button>
      </li>
    ` 
        // isDone armazena se a tarefa está marcada como done ou vazio ''
        // o data-task é um parâmetro que foi atribuido, para ser utilizado na hora de excluir através da function remove.Button_click
        // o nome task no data poderia ser outro
  },
 
  insertHTML: function(element, htmlString) {
    element.innerHTML += htmlString

    this.cacheSelectors()
    this.bindEvents()
  },

  buildTasks: function() { //pegar as tarefas e montar na tela
    let html = ''
    
    this.tasks.forEach(item => {
      html += this.getTaskHtml(item.task, item.done)
      // sobre (item.task)
      // o primeiro item é referente ao item dessa função
      // o segundo task é a propriedade task declarada na const obj usado para armazenar o no localstorage, mais a baixo
    })

    this.insertHTML(this.$list, html)
  },

  Events: { //aqui vai ficar as funções dos eventos
    checkButton_click: function(e) { // e = evento
      const li = e.target.parentElement // chegar na (li class) do (ul list) da (section wrapper-list) para atribuir done a ela
      const value = li.dataset['task']
      const isDone = li.classList.contains('done') // contains checa se ('done') existe dentro de (li)

      const newTaskState = this.tasks.map(item => {
        if (item.task === value) {
          item.done =!isDone
        }

        return item
      })

      localStorage.setItem('tasks', JSON.stringify(newTaskState))

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
      const isDone = false

      if (key === 'Enter') {
        const taskHtml = this.getTaskHtml(value, isDone)

        this.insertHTML(this.$list, taskHtml)

        e.target.value = '' // para "limpar" o input depois de dar entrada

        //para não ficar substituindo a ultima tarefa, fazer o seguinte:
        const savedTasks = localStorage.getItem('tasks')
        const savedTasksArr = JSON.parse(savedTasks) // transforma em objetos

        //armazenar no local storage
        const arrTasks = [
          { task: value, done: isDone }, // const value
          ...savedTasksArr, //...spread operations - assim vai jogar todos os itens dentro dele
        ]

        const jsonTasks = JSON.stringify(arrTasks)

        this.tasks = arrTasks
        localStorage.setItem('tasks', jsonTasks) //já transforma o objeto em string JSON

      }
    },

    removeButton_click: function(e) {
      const li = e.target.parentElement
      // para excluir o item do local storage, vamos buscar o texto dentro do li, e depois excluí-lo
      const value = li.dataset['task']

      //console.log(this.tasks)

      const newTasksState = this.tasks.filter(item => {
        console.log(item.task, value)
        return item.task !== value
      })

      //console.log(newTasksState)

      localStorage.setItem('tasks', JSON.stringify(newTasksState)) // agora ele atualiza as tasks mantendo só as que não foram excluidas, dentre do localstorage
      this.tasks = newTasksState

      li.classList.add('remove')

      setTimeout(function(){
        li.classList.add('hidden')
      },300)
    }
  }

}

Main.init() // executa o Main para funcionar a aplicação