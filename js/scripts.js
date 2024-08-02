let attachmentCount = 1
let attachments = [] // Array para armazenar anexos

document.addEventListener("DOMContentLoaded", function () {
  let productCount = 1
  // Função que está calculando o valor total de um produto com base na quantidade em estoque e no valor unitário
  function calculateTotal(productId) {
    console.log("Função chamada")
    const quantity =
      parseFloat(document.getElementById(`qtdEstoque-${productId}`).value) || 0
    const unitPrice =
      parseFloat(document.getElementById(`valorUnitario-${productId}`).value) ||
      0
    const totalPrice = document.getElementById(`valorTotal-${productId}`)

    console.log(`Quantidade: ${quantity}, Preço Unitário: ${unitPrice}`)
    totalPrice.value = (quantity * unitPrice).toFixed(2)
  }

  document.querySelectorAll(".produto").forEach((product) => {
    const productId = product.id.split("-")[1]
    document
      .getElementById(`qtdEstoque-${productId}`)
      .addEventListener("input", () => {
        calculateTotal(productId)
      })
    document
      .getElementById(`valorUnitario-${productId}`)
      .addEventListener("input", () => {
        calculateTotal(productId)
      })
  })

  document
    .getElementById("addProductButton")
    .addEventListener("click", function () {
      productCount++
      const productSection = document.createElement("section")
      productSection.classList.add("produto")
      productSection.id = `produto-${productCount}`
      productSection.innerHTML = `
      <img src="./img/excluir.png" alt="excluir" class="excluir" onclick="removeProduct(${productCount})"/>
      <section class="excluir-produto">
        <section class="excluir-pacote">
          <span>Produto - ${productCount}</span>
          <img src="./img/pacote.png" alt="pacote" class="pacote" />
          <section class="produto-espicificidade">
            <div>
              <label for="descricao-${productCount}">Descrição</label>
              <input type="text" id="descricao-${productCount}" required/>
            </div>
            <section class="espicificidade">
              <div>
                <label for="unidadeMedida-${productCount}">Unidade de Medida</label>
                <select id="unidadeMedida-${productCount}" required>
                  <option>Metro</option>
                  <option>Metros(m)</option>
                  <option>Centímetros(cm)</option>
                  <option>Kilogramas(kg)</option>
                  <option>Gramas(g)</option>
                  <option>Litros(L)</option>
                  <option>Mililitros(mL)</option>
                </select>
              </div>
              <div>
                <label for="qtdEstoque-${productCount}">Quantidade em Estoque</label>
                <input type="number" id="qtdEstoque-${productCount}" required/>
              </div>
              <div>
                <label for="valorUnitario-${productCount}">Valor Unitário</label>
                <input type="number" id="valorUnitario-${productCount}" required/>
              </div>
              <div>
                <label for="valorTotal-${productCount}">Valor Total</label>
                <input type="number" id="valorTotal-${productCount}" class="valor-total" required readonly/>
              </div>
            </section>
          </section>
        </section>
      </section>
    `
      document.querySelector(".produtos").appendChild(productSection)

      document
        .getElementById(`qtdEstoque-${productCount}`)
        .addEventListener("input", () => {
          calculateTotal(productCount)
        })
      document
        .getElementById(`valorUnitario-${productCount}`)
        .addEventListener("input", function () {
          calculateTotal(productCount)
        })
    })

  window.removeProduct = function (productId) {
    document.getElementById(`produto-${productId}`).remove()
  }

  document
    .getElementById("addAttachmentButton")
    .addEventListener("click", function () {
      attachmentCount++
      const attachmentDiv = document.createElement("div")
      attachmentDiv.id = `attachment-${attachmentCount}`
      attachmentDiv.innerHTML = `
      <img src="./img/excluir.png" alt="excluir" class="excluirAnexo" onclick="removeAttachment(${attachmentCount})"/>
      <img src="./img/olho.png" alt="olho" class="visualizarAnexo" onclick="viewAttachment(${attachmentCount})"/>
      <p>Documento anexo ${attachmentCount}</p>
    `
      document.querySelector(".itens").appendChild(attachmentDiv)
    })

  // Simular o armazenamento do anexo
  attachments.push({
    indice: attachmentCount,
    nomeArquivo: `Documento ${attachmentCount}`,
    blobArquivo: `Blob ${attachmentCount}`,
  })
  sessionStorage.setItem("attachments", JSON.stringify(attachments))
})

window.removeAttachment = function (attachmentId) {
  const attachmentDiv = document.getElementById(`attachment-${attachmentId}`)
  if (attachmentDiv) {
    attachmentDiv.remove()
    attachments = attachments.filter((att) => att.indice !== attachmentId)
    sessionStorage.setItem("attachments", JSON.stringify(attachments))
  }
}

window.viewAttachment = function (attachmentId) {
  const attachment = attachments.find((att) => att.indice === attachmentId)
  if (attachment) {
    const blob = new Blob([attachment.blobArquivo], {
      type: "application/octet-stream",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = attachment.nomeArquivo
    a.click()
    URL.revokeObjectURL(url)
  }
}

document.getElementById("cep").addEventListener("blur", function () {
  const cep = this.value.replace(/\D/g, "")
  preencherEndereco(cep)
})

function preencherEndereco(cep) {
  if (cep.length === 8) {
    try {
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then((response) => response.json())
        .then((data) => {
          if (data.erro) {
            alert("CEP não encontrado.")
            return
          }
          document.getElementById("endereco").value = data.logradouro
          document.getElementById("bairro").value = data.bairro
          document.getElementById("municipio").value = data.localidade
          document.getElementById("estado").value = data.uf
        })
    } catch (error) {
      alert("Erro ao buscar endereço.")
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const attachments = [] // Lista para armazenar anexos

  function addErrorBorder(element) {
    element.style.border = "2px solid red"
  }

  function removeErrorBorder(element) {
    element.style.border = ""
  }

  function validarFormulario() {
    let isValid = true
    const errorMsg = document.getElementById("errorMsg")

    // Remove qualquer mensagem de erro anterior
    errorMsg.textContent = ""
    const mainForm = document.getElementById("mainForm")
    if (mainForm) removeErrorBorder(mainForm)

    // Validação dos campos obrigatórios
    const requiredFields = [
      { id: "razaoSocial", errorId: "error-razaoSocial" },
      { id: "nomeFantasia", errorId: "error-nomeFantasia" },
      { id: "cnpj", errorId: "error-cnpj" },
      { id: "cep", errorId: "error-cep" },
      { id: "endereco", errorId: "error-endereco" },
      { id: "numero", errorId: "error-numero" },
      { id: "contatoNome", errorId: "error-contatoNome" },
      { id: "telefone", errorId: "error-telefone" },
      { id: "email", errorId: "error-email" },
    ]

    let allFieldsValid = true
    requiredFields.forEach(({ id, errorId }) => {
      const field = document.getElementById(id)
      const errorField = document.getElementById(errorId)
      if (!field || !field.value.trim()) {
        if (field) addErrorBorder(field)
        if (errorField) errorField.textContent = "Este campo é obrigatório"
        allFieldsValid = false
      } else {
        if (field) removeErrorBorder(field)
        if (errorField) errorField.textContent = ""
      }
    })

    // Validação dos produtos
    const produtos = document.querySelectorAll(".produto")
    let hasProducts = false
    let produtosValid = true

    produtos.forEach((produto) => {
      const descricao = produto.querySelector('input[id^="produto-"]')
      const unidadeMedida = produto.querySelector(
        'select[id^="unidadeMedida-"]'
      )
      const qtdEstoque = produto.querySelector('input[id^="qtdEstoque-"]')
      const valorUnitario = produto.querySelector('input[id^="valorUnitario-"]')
      const valorTotal = produto.querySelector('input[id^="valorTotal-"]')

      if (descricao && unidadeMedida && qtdEstoque && valorUnitario) {
        const descricaoError = produto.querySelector(
          '.error-message[id^="error-produto-"]'
        )
        const unidadeMedidaError = produto.querySelector(
          '.error-message[id^="error-unidadeMedida-"]'
        )
        const qtdEstoqueError = produto.querySelector(
          '.error-message[id^="error-qtdEstoque-"]'
        )
        const valorUnitarioError = produto.querySelector(
          '.error-message[id^="error-valorUnitario-"]'
        )
        const valorTotalError = produto.querySelector(
          '.error-message[id^="error-valorTotal-"]'
        )

        if (
          !descricao.value.trim() ||
          !unidadeMedida.value.trim() ||
          !qtdEstoque.value.trim() ||
          !valorUnitario.value.trim()
        ) {
          if (descricao) addErrorBorder(descricao)
          if (unidadeMedida) addErrorBorder(unidadeMedida)
          if (qtdEstoque) addErrorBorder(qtdEstoque)
          if (valorUnitario) addErrorBorder(valorUnitario)
          if (descricaoError)
            descricaoError.textContent = "Este campo é obrigatório"
          if (unidadeMedidaError)
            unidadeMedidaError.textContent = "Este campo é obrigatório"
          if (qtdEstoqueError)
            qtdEstoqueError.textContent = "Este campo é obrigatório"
          if (valorUnitarioError)
            valorUnitarioError.textContent = "Este campo é obrigatório"
          produtosValid = false
        } else {
          removeErrorBorder(descricao)
          removeErrorBorder(unidadeMedida)
          removeErrorBorder(qtdEstoque)
          removeErrorBorder(valorUnitario)
          if (descricaoError) descricaoError.textContent = ""
          if (unidadeMedidaError) unidadeMedidaError.textContent = ""
          if (qtdEstoqueError) qtdEstoqueError.textContent = ""
          if (valorUnitarioError) valorUnitarioError.textContent = ""
          hasProducts = true
        }
      }
    })

    // Validação dos anexos
    const attachmentsContainer = document.getElementById("attachmentsContainer")
    let hasAttachments =
      attachmentsContainer && attachmentsContainer.children.length > 0

    // Verifica se há pelo menos um produto e um anexo
    if (!hasProducts) {
      isValid = false
      errorMsg.textContent = "É obrigatório adicionar pelo menos um produto."
    }

    if (!hasAttachments) {
      isValid = false
      if (errorMsg.textContent) {
        errorMsg.textContent += " "
      }
      errorMsg.textContent +=
        "É obrigatório incluir pelo menos um documento anexo."
      if (attachmentsContainer) addErrorBorder(attachmentsContainer)
    } else {
      if (attachmentsContainer) removeErrorBorder(attachmentsContainer)
    }

    if (!allFieldsValid || !isValid) {
      alert(
        "Por favor, preencha todos os campos obrigatórios e adicione pelo menos um produto e um documento anexo."
      )
    }

    return allFieldsValid && isValid
  }

  document.getElementById("saveButton").addEventListener("click", function () {
    if (!validarFormulario()) return

    const fornecedorData = {
      razaoSocial: document.getElementById("razaoSocial").value,
      nomeFantasia: document.getElementById("nomeFantasia").value,
      cnpj: document.getElementById("cnpj").value,
      cep: document.getElementById("cep").value,
      endereco: document.getElementById("endereco").value,
      numero: document.getElementById("numero").value,
      bairro: document.getElementById("bairro").value,
      municipio: document.getElementById("municipio").value,
      estado: document.getElementById("estado").value,
      contatoNome: document.getElementById("contatoNome").value,
      telefone: document.getElementById("telefone").value,
      email: document.getElementById("email").value,
    }

    const produtos = Array.from(document.querySelectorAll(".produto")).map(
      (produto) => {
        const id = produto.id.split("-")[1]
        return {
          produto: document.getElementById(`produto-${id}`).value,
          unidadeMedida: document.getElementById(`unidadeMedida-${id}`).value,
          qtdEstoque: document.getElementById(`qtdEstoque-${id}`).value,
          valorUnitario: document.getElementById(`valorUnitario-${id}`).value,
          valorTotal: document.getElementById(`valorTotal-${id}`).value,
        }
      }
    )

    const fornecedorJson = JSON.stringify({
      fornecedor: fornecedorData,
      produtos: produtos,
      anexos: attachments,
    })

    console.log(fornecedorJson)
    alert("Fornecedor salvo com sucesso!")

    // aqui dava para enviar o JSON para o servidor
  })

  // e ainda podia ter uma função para enviar arquivos e anexos
})
