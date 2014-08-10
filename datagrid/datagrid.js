/** Datagrid - TINS - Palmas - Tocantins - Brasil!
*
* //------------------------------------------------------------------------
* // retorno dos dados
* //------------------------------------------------------------------------
* pagina: 2,
* numeroPorPagina: 30,
* ordenadoPor: 'campoX',
* direcao:	'-', 		// '' ou '-'
*
* dados : [
*      {
*          'pk': '234',
*          'nome': 'TINS',
*          'cidade': 'Palmas'
*
*      },
*      {
*          'pk': '2344',
*          'nome': 'MATRIZ',
*          'cidade': 'Goiania'
*      }
* ]
*
**/

(function ($) {

    "use strict";

    var DatagridTins;

    DatagridTins = function (elemento, options) {

        // Merge the options.
        this.opcoes = options;
        if( !this.opcoes.identificacao )
            this.opcoes.identificacao = "datagrid-tins-"+Math.round(new Date().getTime() + (Math.random() * 100));                           // gera identificacao - usado no collapse

        // se preferir, chama o elemento setado
        this.elemento = elemento;

        // se nao tiver colunas,
        if (this.opcoes.colunas == null) {
            return;
        }

        // se nao tiver declarado a ordenacao, pega a primeira coluna
        if (this.opcoes.ordenadoPor == null)
            this.opcoes.ordenadoPor = this.opcoes.colunas[0][0];

        var $datagrid = $(this.elemento);
        $datagrid.addClass("datagrid-tins "+this.opcoes.identificacao);

        var $datagrid_cabecalho = $("<div></div>").addClass("datagrid-tins-cabecalho");
        var $datagrid_conteudo = $("<div></div>").addClass("datagrid-tins-conteudo");

        /*
        *---------------------------------------------------------------------------------------
        *
        *   gerar cabecalho
        *
        *---------------------------------------------------------------------------------------
        */
        var $cabecalho_botao    = $("<div></div>")
            .addClass("cabecalho-botao");
        var $cabecalho_conteudo = $("<div></div>")
            .addClass("cabecalho-conteudo")
            .addClass( this.opcoes.identificacao );
        $datagrid_cabecalho.append(
            $cabecalho_botao,
            $cabecalho_conteudo
        );
        /*
        * Adiciona contador ao Cabecalho -> Conteudo
        * */

        this.cabecalho = {
            contador: null,
            botaoCollapse: $cabecalho_botao,
            botoes: {
                grupoNavegacao: {                                                                                           //  grupo dos botoes de navegacao
                    botaoPaginaInicio: null,                                                                                //  poder usar o DISABLED quando for pagina 1
                    botaoPaginaFinal: null,
                    botaoPaginaAnterior: null,
                    botaoPaginaProximo: null,
                    renderizar: function(){
                        /*
                        * Gera o grupo com os botoes, que serah anexado a algum COLLAPSE
                        * */
                        var $grupos = [
                            $("<div></div>")                                                                                // grupo botao INICIO
                                .addClass("btn-group")
                                .append(
                                    this.botaoPaginaInicio
                                )
                            ,
                            $("<div></div>")                                                                                // grupo botoes ANTERIOR E PROXIMO
                                .addClass("btn-group")
                                .append(
                                    this.botaoPaginaAnterior,
                                    this.botaoPaginaProximo
                                )
                            ,
                            $("<div></div>")                                                                                // grupo botao FINAL
                                .addClass("btn-group")
                                .append(
                                    this.botaoPaginaFinal
                                )
                        ];

                        return $grupos;
                    }
                },
                grupoPesquisa: {
                    botao: null,
                    entrada: null,
                    renderizar: function(){
                        var $grupos = $("<div></div>")
                            .addClass("form-inline")
                            .append(
                                $("<div></div>").addClass("form-group").append(
                                    $("<div></div>").addClass("input-group has-warning").append(
                                        this.entrada,
                                        $("<span></span>").addClass("input-group-btn").append(
                                            this.botao
                                        )
                                    )
                                )
                            );
                        return $("<div></div>").addClass("btn-group").append($grupos);
                    }
                },
                grupoAtualizar: {
                    botao: null,
                    renderizar: function(){
                        var $grupos = $("<div></div>")
                            .addClass("btn-group")
                            .append(
                                this.botao
                            );
                        return $grupos;
                    }
                },
                grupoOrdenacao:{
                    botaoOrdenar: {                                                                                         // OBS, nao possui um botao unico, eh uma lista
                        titulo: null,
                        botao: null,
                        dropDown: {                                                                                         // este dropdown diferencia por conta de
                            lista: null,                                                                                    //   um botao extra no final da lista
                            botaoDirecao: {
                                botao: null,
                                titulo: null
                            }
                        }
                    },
                    renderizar: function(){
                        var $grupos = $("<div></div>")                                                                      // botao Ordenar TOGGLE
                            .addClass("btn-group")
                            .append(
                                this.botaoOrdenar.botao,
                                this.botaoOrdenar.dropDown.lista
                            );
                        return $grupos;
                    }
                },

                grupoTela:{
                    botaoTela: {
                        titulo: null,
                        botao: null,
                        dropDown: null
                    },
                    renderizar: function(){
                        var $grupos = $("<div></div>")                                                                      // botao Ordenar TOGGLE
                            .addClass("btn-group")
                            .append(
                                this.botaoTela.botao,
                                this.botaoTela.dropDown
                            );
                        return $grupos;
                    }
                }
            },
            grupoCollapse : {
                "grupoCollapsePequena": [],
                "grupoCollapseMedia": [],
                "grupoCollapseGrande": [],
                "grupoCollapseLarga": []
            }
        };

        /*
        * Botao collapse
        * */
        this.cabecalho.botaoCollapse = $("<button></button>")
            .addClass("btn btn-default pull-right")
            .attr({
                'data-toggle': "collapse",
                'data-target': "." + this.opcoes.identificacao + " .datagrid-tins-cabecalho .cabecalho-conteudo > .cabecalho-hide,."+
                    this.opcoes.identificacao + " .datagrid-tins-cabecalho .cabecalho-conteudo > .cabecalho-hide ~ div"
            })
            .append(
                $("<span></span>").addClass("glyphicon glyphicon-list"),
                "&nbsp;"
            );

        /*
         * Gera botao para telas pequenas
         * */
        $cabecalho_botao.append(
            this.cabecalho.botaoCollapse
        );
        /*
        * Contador do cabecalho
        * */
        this.cabecalho.contador = $("<div></div>").addClass("cabecalho-contador");                                      // cria espaco para contador

        /*
        * Gera os collapse
        * */
        var $cabecalho_conteudo_collapse_pequena = $("<div></div>").addClass("collapse cabecalho-tamanho-pequena");
        var $cabecalho_conteudo_collapse_media = $("<div></div>").addClass("collapse cabecalho-tamanho-media");
        var $cabecalho_conteudo_collapse_grande = $("<div></div>").addClass("collapse cabecalho-tamanho-grande");
        var $cabecalho_conteudo_collapse_larga = $("<div></div>").addClass("collapse cabecalho-tamanho-larga");

        $cabecalho_conteudo.append(
            this.cabecalho.contador,                                                                                    // junsta o contador e os collapses
            $cabecalho_conteudo_collapse_pequena,
            $cabecalho_conteudo_collapse_media,
            $cabecalho_conteudo_collapse_grande,
            $cabecalho_conteudo_collapse_larga
        );

        /*
        *---------------------------------------------------------------------------------------------------------------
        * botoes de navegacao
        *---------------------------------------------------------------------------------------------------------------
        * */
        this.cabecalho.botoes.grupoNavegacao.botaoPaginaInicio = $("<button></button>")
            .addClass("btn btn-info")
            .attr("type","button")
            .append(
                "&nbsp;",
                $("<span></span>").addClass("glyphicon glyphicon-step-backward")
            )
            .click({'elemento': this, 'botao':"inicio"}, this.botoesNavegacao);

        this.cabecalho.botoes.grupoNavegacao.botaoPaginaAnterior = $("<button></button>")
            .addClass("btn btn-primary")
            .attr("type","button")
            .append(
                "&nbsp;",
                $("<span></span>").addClass("glyphicon glyphicon-backward")
            )
            .click({'elemento': this, 'botao':"anterior"}, this.botoesNavegacao);

        this.cabecalho.botoes.grupoNavegacao.botaoPaginaProximo = $("<button></button>")
            .addClass("btn btn-primary")
            .attr("type","button")
            .append(
                "&nbsp;",
                $("<span></span>").addClass("glyphicon glyphicon-forward")
            )
            .click({'elemento': this, 'botao':"proximo"}, this.botoesNavegacao);

        this.cabecalho.botoes.grupoNavegacao.botaoPaginaFinal = $("<button></button>")
            .addClass("btn btn-info")
            .attr("type","button")
            .append(
                "&nbsp;",
                $("<span></span>").addClass("glyphicon glyphicon-step-forward")
            )
            .click({'elemento': this, 'botao':"final"}, this.botoesNavegacao);

        /*
        *---------------------------------------------------------------------------------------------------------------
        * formulario de busca
        *---------------------------------------------------------------------------------------------------------------
        * */
        this.cabecalho.botoes.grupoPesquisa.botao = $("<button></button>")
            .attr("type", "button")
            .addClass("btn btn-warning")
            .append(
                $("<span></span>").addClass("glyphicon glyphicon-search"),
                "Buscar"
            )
            .click({'elemento': this}, this.botaoBuscar);


        this.cabecalho.botoes.grupoPesquisa.entrada = $("<input>")
            .addClass("form-control").attr({
                type:"text",
                placeholder:"Buscar..."
            })
            .keypress({'elemento': this}, function(event){
                if( event.keyCode == 13){
                    event.data['elemento'].cabecalho.botoes.grupoPesquisa.botao.click()
                }
            });

        /*
        *---------------------------------------------------------------------------------------------------------------
        * botao atualizar
        *---------------------------------------------------------------------------------------------------------------
        * */
        this.cabecalho.botoes.grupoAtualizar.botao = $("<button></button>")
            .addClass("btn btn-success")
            .attr("type","button")
            .append(
                $("<span></span>").addClass("glyphicon glyphicon-refresh"),
                "Atualizar"
            )
            .click({'elemento': this}, this.botaoAtualizar);

        /*
        *---------------------------------------------------------------------------------------------------------------
        * botao ordenar
        *
        * armazena o objeto que gera o titulo, assim podemos atualizar toda vez que clicar numa das opcoes abaixo
        *
        * Como eh uma lista de opcoes, os clicks sao feitos logo abaixo, ao gerar o cabecalho_conteudo_collapse_grande
        *---------------------------------------------------------------------------------------------------------------
        * */
        this.cabecalho.botoes.grupoOrdenacao.botaoOrdenar.titulo = $("<span></span>");
        this.cabecalho.botoes.grupoOrdenacao.botaoOrdenar.botao = $("<button></button>")
            .addClass("btn btn-info dropdown-toggle")
            .attr({
                'type': "button",
                'data-toggle':"dropdown"
            })
            .append(
                $("<span></span>").addClass("glyphicon glyphicon-sort"),
                this.cabecalho.botoes.grupoOrdenacao.botaoOrdenar.titulo,
                $("<span></span>").addClass("caret")
            );

        /*
        ****************************************************************************************************************
        * gera lista para o dropdown
        ****************************************************************************************************************
        * */
        this.cabecalho.botoes.grupoOrdenacao.botaoOrdenar.dropDown.botaoDirecao.titulo = $("<span></span>")
            .text(
                this.opcoes.direcaoLabel[ this.opcoes.direcao ]                                                         // adiciona o Label de acordo a opcao de direcionacao
            );
        this.cabecalho.botoes.grupoOrdenacao.botaoOrdenar.dropDown.botaoDirecao.botao = $("<a></a>")
            .attr({
                'href':"javascript:void(0)",
                'data-coluna': "btn-sort"
            })
            .append(
                $("<span></span>").addClass("glyphicon glyphicon-sort"),
                this.cabecalho.botoes.grupoOrdenacao.botaoOrdenar.dropDown.botaoDirecao.titulo
            )
            .click({'elemento': this}, this.botaoDirecao)
        ;

        /*
         ***************************************************************************************************************
         * gera lista para o dropdown
         ***************************************************************************************************************
         * */
        this.cabecalho.botoes.grupoOrdenacao.botaoOrdenar.dropDown.lista = $("<ul></ul>").addClass("dropdown-menu")            // cria a lista do dropdown

        // FAZER UM FOR PARA ENCONTRAR O VALUE CONFORME O LABEL EM THIS.OPCOES.COLUNAS
        for( var i = 0; i < this.opcoes.colunas.length ; i++){
            var tupla = this.opcoes.colunas[i];

            if(tupla[0] == this.opcoes.ordenadoPor)                                                         // checa se eh o campo padrao para ordenacao
                this.cabecalho.botoes.grupoOrdenacao.botaoOrdenar.titulo.text(tupla[1]);                                        // adiciona o LABEL como valor padrao no botao ordenar

            /*
             * Gera os botoes para o dropdown
             * */
            this.cabecalho.botoes.grupoOrdenacao.botaoOrdenar.dropDown.lista.append(
                $("<li></li>").append(
                    $("<a></a>")
                        .attr({
                            'href': "javascript:void(0)",
                            'data-coluna': tupla[0]
                        })
                        .append(
                            $("<span></span>").addClass("glyphicon glyphicon-asterisk"),
                            $("<span></span>").text( tupla[1] )                                                         // insere o TEXTO equivalente aa coluna
                        )
                        .click( {'elemento': this, 'coluna': tupla[0]},this.botaoOrdenar)                               // especifica qual a coluna que sera ordenado
                )
            );
        }

        /*
         ***************************************************************************************************************
         * adiciona o botao de DIRECAO ao dropdown ORDENACAO
         ***************************************************************************************************************
         * */

        this.cabecalho.botoes.grupoOrdenacao.botaoOrdenar.dropDown.lista
            .append(
                $("<li></li>").addClass("divider"),
                $("<li></li>").append(                                                                                  // e adiciona o botao de DIRECIONACAO ao DropDown ORDENACAO
                    this.cabecalho.botoes.grupoOrdenacao.botaoOrdenar.dropDown.botaoDirecao.botao
                )
            );
        /*
        *---------------------------------------------------------------------------------------------------------------
        * Gera titulo do botao TELA
        *---------------------------------------------------------------------------------------------------------------
        * */
        if(this.opcoes.autoAjuste){
            this.cabecalho.botoes.grupoTela.botaoTela.titulo = $("<span></span>").text(
                this.opcoes.classesTamanhoTabela[' ']
            );
        }else{
            this.cabecalho.botoes.grupoTela.botaoTela.titulo = $("<span></span>").text(
                this.opcoes.classesTamanhoTabela[ this.opcoes.tamanhoPadrao ]
            );
        }
        this.cabecalho.botoes.grupoTela.botaoTela.botao = $("<button></button>")
            .addClass("btn btn-info dropdown-toggle")
            .attr({
                'type': "button",
                'data-toggle': "dropdown"
            })
            .append(
                $("<span></span>").addClass("glyphicon glyphicon-th-large"),
                this.cabecalho.botoes.grupoTela.botaoTela.titulo,
                $("<span></span>").addClass("caret")
            );

        /*
        *---------------------------------------------------------------------------------------------------------------
        * Gera DROPDOWN do botao TELA
        *---------------------------------------------------------------------------------------------------------------
        * */
        this.cabecalho.botoes.grupoTela.botaoTela.dropDown = $("<ul></ul>").addClass("dropdown-menu");
        for( var key in this.opcoes.classesTamanhoTabela ){
            this.cabecalho.botoes.grupoTela.botaoTela.dropDown.append(
                $("<li></li>").append(
                    $("<a></a>")
                        .attr({
                            'href': "javascript:void(0)",
                            'data-coluna': key
                        })
                        .append(
                            $("<span></span>")
                                .addClass("glyphicon glyphicon-asterisk"),
                            $("<span></span>")
                                .text( this.opcoes.classesTamanhoTabela[ key ] )
                        )
                        .click({'elemento': this,'chave': key}, this.botaoTela)
                )
            )
        }

        /*
        *---------------------------------------------------------------------------------------
        *
        * Gera o conteudo dos collapse, conforme configuracoes
        *
        *---------------------------------------------------------------------------------------
        * */

         /*
         * Checa nas opcoes, onde cada grupo de botoes ficarah no collapse
         * Conforme foram declarados em this.cabecalho.botoes
         * */
        for( var el in this.cabecalho.botoes ){
            // coloca no grupo do collapse, conforme o configurado em cada grupo de botao configurado em opcoes
            this.cabecalho.grupoCollapse[this.opcoes[el]].push( this.cabecalho.botoes[el] );
        }

        /*
        * Junta aos collapse, os grupos configurados pelo usuario grupoCollapseXxxxx
        * */
        for( var el in this.cabecalho.grupoCollapse ){
            this.cabecalho.grupoCollapse[el]
                .push
                .apply(
                    this.cabecalho.grupoCollapse[el],
                    this.opcoes[el]
                )
        }

        /*
        * Chama os renderizadores, para cada collapse
        * */
        for( var el in this.cabecalho.grupoCollapse.grupoCollapsePequena ){
             $cabecalho_conteudo_collapse_pequena.append(
                 this.cabecalho.grupoCollapse.grupoCollapsePequena[el].renderizar()
            );
        }
        for( var el in this.cabecalho.grupoCollapse.grupoCollapseMedia ){
            $cabecalho_conteudo_collapse_media.append(
                this.cabecalho.grupoCollapse.grupoCollapseMedia[el].renderizar()
            );
        }
        for( var el in this.cabecalho.grupoCollapse.grupoCollapseGrande ){
            $cabecalho_conteudo_collapse_grande.append(
                this.cabecalho.grupoCollapse.grupoCollapseGrande[el].renderizar()
            );
        }
        for( var el in this.cabecalho.grupoCollapse.grupoCollapseLarga ){
            $cabecalho_conteudo_collapse_larga.append(
                this.cabecalho.grupoCollapse.grupoCollapseLarga[el].renderizar()
            );
        }

        /*
        *---------------------------------------------------------------------------------------
        *
        *   junta tudo
        *
        *---------------------------------------------------------------------------------------
        */
        this.conteudo = $datagrid_conteudo;                                                                             // localizacao do conteudo
        $datagrid.append(
            $datagrid_cabecalho,
            $datagrid_conteudo//,
            //$datagrid_cabecalho.clone(true, true)
        );

        /* checa tamanho do container para adaptar, se necessario*/
        this.__checaTamanho();                                                                                          //  ajusta tamanhos e classes - apenas 1 vez

        /* faz a requisicao dos dados */
        this.__requisitar();

        return this;
    };

    /* metodos */
    DatagridTins.prototype = {
        /*
        *   PARA CADA FUNCAO, CHEGAR SE 'THIS' EH O PROPRIO DATAGRID (quando chamado por '$') OU
        *   SE EH BOTOES OU WINDOW (quando uma funcao for chamada pela window.resize ou botoes)
        * */
        botoesNavegacao: function(evento){                                                                              //  botoes para navegacao
            if ( "data" in evento){
                var $elemento = evento.data['elemento'];
                var botao = evento.data['botao'];

                switch (botao){
                    case 'inicio':
                        $elemento.opcoes.pagina = 1;
                        break;
                    case 'anterior':
                        if( $elemento.opcoes.pagina > 1)
                            $elemento.opcoes.pagina--;

                        break;
                    case 'proximo':
                        if( $elemento.opcoes.pagina < $elemento.opcoes.totalPaginas)
                            $elemento.opcoes.pagina++;
                        break;
                    case 'final':
                        $elemento.opcoes.pagina = $elemento.opcoes.totalPaginas;
                        break;
                }

                $elemento.__requisitar();
            }
        },
        botaoAtualizar: function(evento){
            if ( "data" in evento){                                                                                     // soh pode ser chamado por BOTOES
                var $elemento = evento.data['elemento'];

                // requisita novamente
                $elemento.__requisitar();
            }

        },
        botaoBuscar: function(evento){
            if ( "data" in evento){                                                                                     // soh pode ser chamado por BOTOES
                var $elemento = evento.data['elemento'];

                $elemento.opcoes.buscar = $elemento.cabecalho.botoes.grupoPesquisa.entrada.val();
                $elemento.__requisitar();
            }
        },
        botaoTela: function(evento){
            if ( "data" in evento){                                                                                     // soh pode ser chamado por BOTOES
                var $elemento = evento.data['elemento'];
                var tamanho = evento.data['chave'];

                // eh automatico
                if(tamanho == " "){
                    $elemento.opcoes.autoAjuste = true;
                } else {
                    $elemento.opcoes.autoAjuste = false;
                }
                // seta o tamanho escolhido
                $elemento.opcoes.tamanhoPadrao = tamanho;
                // chama a funcao que arruma o datagrid
                $elemento.__checaTamanho();
            }
        },
        botaoOrdenar: function(evento){
            if ( "data" in evento){                                                                                     // soh pode ser chamado por BOTOES
                var $elemento = evento.data['elemento'];
                var ordenar_por = evento.data['coluna'];

                $elemento.opcoes.ordenadoPor = ordenar_por;

                // atualiza a informacao no botao
                for( var i = 0 ; i < $elemento.opcoes.colunas.length ; i++ )
                    if ( $elemento.opcoes.colunas[i][0] == ordenar_por ){
                        $elemento.cabecalho.botoes.grupoOrdenacao.botaoOrdenar.titulo
                            .text( $elemento.opcoes.colunas[i][1]);
                        break;
                    }
                $elemento.__requisitar();
            }
        },
        botaoDirecao: function(evento){
            if ( "data" in evento){                                                                                     // soh pode ser chamado por BOTOES
                var $elemento = evento.data['elemento'];

                if( $elemento.opcoes.direcao == ''){
                    $elemento.opcoes.direcao = '-'
                } else {
                    $elemento.opcoes.direcao = '';
                }

                $elemento.cabecalho.botoes.grupoOrdenacao.botaoOrdenar.dropDown.botaoDirecao.titulo
                    .text($elemento.opcoes.direcaoLabel[$elemento.opcoes.direcao]);

                $elemento.__requisitar();
            }
        },
        /*
        * Funcao que pode ser chaamda pelo usuario via $.datagrid_tins
        * */
        requisitaDados: function(opcoes){
            // adiciona as opcoes do usuario
            $.extend(this.opcoes, opcoes);
            // executa a requisicao
            this.__requisitar();
        },
        //---------------------------------------------------------------------------------
        //  chamado pelo RESIZE do window
        //  esse difere porque o window tambem pode chama-lo
        //---------------------------------------------------------------------------------
        resize: function(evento){
            var $elemento;
            if ( evento === undefined ){                                                                                // quando chamado por '$().datagrid_tins().botaoAtualizar()';
                $elemento = this;
            } else {                                                                                                    // quando chamado por um botao pelo 'evento' de 'click()'
                $elemento = evento.data['elemento'].datagrid_tins;
            }

            // chama checa Tamanho
            $elemento.__checaTamanho();
        },

        /*
         * funcoes que sempre saberao que THIS sou eu
         * */
        __checaBotoesNavegacao: function(){
            // se (pagina == maximo) && (pagina == 1)
            if( (this.opcoes.pagina == this.opcoes.totalPaginas) && (this.opcoes.pagina == 1) ){
                this.cabecalho.botoes.grupoNavegacao.botaoPaginaInicio.addClass("disabled");
                this.cabecalho.botoes.grupoNavegacao.botaoPaginaAnterior.addClass("disabled");
                this.cabecalho.botoes.grupoNavegacao.botaoPaginaProximo.addClass("disabled");
                this.cabecalho.botoes.grupoNavegacao.botaoPaginaFinal.addClass("disabled");
            }
            else
            // se pagina == 1
            if(this.opcoes.pagina == 1){
                this.cabecalho.botoes.grupoNavegacao.botaoPaginaInicio.addClass("disabled");
                this.cabecalho.botoes.grupoNavegacao.botaoPaginaAnterior.addClass("disabled");
                this.cabecalho.botoes.grupoNavegacao.botaoPaginaProximo.removeClass("disabled");
                this.cabecalho.botoes.grupoNavegacao.botaoPaginaFinal.removeClass("disabled");
            }
            else
            // se pagina == maximo
            if(this.opcoes.pagina == this.opcoes.totalPaginas){
                this.cabecalho.botoes.grupoNavegacao.botaoPaginaInicio.removeClass("disabled");
                this.cabecalho.botoes.grupoNavegacao.botaoPaginaAnterior.removeClass("disabled");
                this.cabecalho.botoes.grupoNavegacao.botaoPaginaProximo.addClass("disabled");
                this.cabecalho.botoes.grupoNavegacao.botaoPaginaFinal.addClass("disabled");
            }
        },
         __carregamento: function(){
            return $("<div></div>")
                .addClass("conteudo-vazio conteudo-vazio-carregando")
                .append(
                    $("<div>").addClass("conteudo-vazio-carregando-icone"),
                    $("<div>").text(
                        this.opcoes.carregamentoRequisicao
                    )
                );
        },
         __semDadosRequisicao: function () {
            return $("<div></div>")
                .addClass("conteudo-vazio conteudo-vazio-info")
                .html( this.opcoes.semDadosRequisicao );
        },
        __erroRequisicao: function () {
            return $("<div></div>")
                .addClass("conteudo-vazio conteudo-vazio-error")
                .html( this.opcoes.erroRequisicao );
        },
        __renderizar: function(){
            // GERA A LISTA DE DADOS EM HTML

            // checar se o usuario setou
            if( typeof this.opcoes.funcaoRenderizadora === "function"){
                // jah eh encaminhado o CONTAINER junto com o THIS
                this.opcoes.funcaoRenderizadora();

                return this;
            }

            /*
            * Utiliza o gerador padrao
            * */
            var gera_dados_item = function(dados_i, cols){
                var colunas_item = [];
                for(var c in cols){
                    colunas_item.push(
                        $("<li></li>")
                            .attr({
                                'data-coluna-nome': cols[c][1],
                                'data-coluna': cols[c][0],
                                'data-valor': dados_i[cols[c][0]] || ""
                            })
                            .html(
                                dados_i[cols[c][0]] || "----"
                            )
                    )
                }
                return colunas_item;
            };

            var gera_item = function(dados_item, colunas){
                return $("<div></div>")
                    .addClass("linha")
                    .append(
                        $("<ul>")
                            .addClass("coluna")
                            .attr("data-pk", dados_item["pk"])
                            .append(
                                gera_dados_item( dados_item, colunas)
                            )
                    );
            };

            var itens = [];
            for(var item in this.opcoes.dados){
                itens
                    .push(
                        gera_item(this.opcoes.dados[item], this.opcoes.colunas)
                    );

            }

            this.conteudo.empty().append(
                itens
            );

            // return elemento
            return this;
        },
        __requisitar: function() {

            var $eu = this;

            if( typeof $eu.opcoes.antesCarregados === "function"){
                $eu.opcoes.antesCarregados();
            }

            // $.ajaxSettings.traditional = true; // causa problema nos dicionarios
            $.post({
                url: this.opcoes.url,
                data: {
                    'csrfmiddlewaretoken': this.opcoes.csrfmiddlewaretoken,
                    'parametros': JSON.stringify(
                        this.opcoes
                    )
                },
                success: function (xhr) {
                    try {
                        // tenta junstar o que retornou com o as opcoes padrao
                        $.extend($eu.opcoes, xhr);

                        if (Object.keys($eu.opcoes.dados).length) {
                            //  gera o conteudo
                            $eu.__renderizar();
                        } else {
                            $eu.conteudo
                                .empty()
                                .append(
                                $eu.__semDadosRequisicao()
                            );
                        }

                        $eu.__atualizaContador();
                        $eu.__checaBotoesNavegacao();

                        if (typeof $eu.opcoes.depoisCarregados === "function") {
                            $eu.opcoes.depoisCarregados();
                        }

                    } catch (e) {
                        $eu.conteudo
                            .empty()
                            .append(
                            $eu.__erroRequisicao()
                        );
                    }
                },
                dataType:"json", //'JSON'
                type:"POST",
                contentType:"application/json; charset=utf-8"
            }).fail(function(xhr){
                    try{
                        var retorno = $.parseJSON(xhr.responseText || "{}");

                        // tenta junstar o que retornou com o as opcoes padrao
                        $.extend( $eu.opcoes, retorno);

                        $eu.conteudo.html( $eu.__erroRequisicao() );
                        $eu.__atualizaContador();
                        $eu.__checaBotoesNavegacao();
                        if( typeof $eu.opcoes.depoisCarregados === "function"){
                            $eu.opcoes.depoisCarregados();
                        }
                    } catch (e){
                        $eu.conteudo.html( $eu.__erroRequisicao() );
                    }
                });

            this.conteudo
                .empty()
                .append(
                    this.__carregamento()
                );

            return this;
        },
        __atualizaContador: function(){

            this.cabecalho.contador
                .empty()
                .append(
                    $("<b></b>")
                        .addClass("text-danger")
                        .empty()
                        .append(
                            this.opcoes.pagina,
                            " : ",
                            this.opcoes.totalPaginas || "?",
                            " {",
                            this.opcoes.quantidadePorPagina,
                            "} "
                        )
            );

            return this;
        },
        __checaTamanho:function(){

            var $eu = $( this.elemento );

            var keys_tamanhos_telas = $.map(this.opcoes.classesTamanhoTabela, function(element,index) {return index});   // pega somente as keys
            // remove todas as classes de TAMANHO
            $eu.removeClass( "datagrid-tins-"+keys_tamanhos_telas.join(" datagrid-tins-"));                                                            //  remove as classes de tamanho

            // remove COLLAPSED do botao
            this.cabecalho.botaoCollapse.removeClass("collapsed");

            var $cabecalho_conteudo = $eu.find(".datagrid-tins-cabecalho .cabecalho-conteudo");
            $cabecalho_conteudo.find("> [class*=cabecalho-tamanho]")                                                                                                   //  remove class cabecalho-hide
                .each(function(){
                    $(this).removeClass("cabecalho-hide");
                    $(this).removeClass("in");
                    $(this).css("height", "auto")
                });

            if( this.opcoes.autoAjuste ){                                                                               //  verifica se eh para usar o AUTO AJUSTE
                var largura = $eu.width();

                if( largura < this.opcoes.limiteTamanhoPequena){
                    $eu.addClass("datagrid-tins-pequena");
                    $cabecalho_conteudo
                        .find("[class*=cabecalho-tamanho-pequena]")
                        .addClass("cabecalho-hide");
                }
                else
                if( largura < this.opcoes.limiteTamanhoMedia){
                    $eu.addClass( "datagrid-tins-media" );
                    $cabecalho_conteudo
                        .find("[class*=cabecalho-tamanho-media]")
                        .addClass("cabecalho-hide");
                }
                else
                if( largura < this.opcoes.limiteTamanhoGrande){
                    $eu.addClass("datagrid-tins-grande");
                    $cabecalho_conteudo
                        .find("[class*=cabecalho-tamanho-grande]")
                        .addClass("cabecalho-hide");
                }
                else
                if(largura < this.opcoes.limiteTamanhoLarga){
                    $eu.addClass( "datagrid-tins-larga");
                    // no hide ninguem
                }
                else
                {
                    $eu.addClass( "datagrid-tins-"+this.opcoes.tamanhoPadrao );                                                    //  se nao for nenhuma das anteriores, usar padrao
                    $cabecalho_conteudo
                        .find("[class*=cabecalho-tamanho-"+this.opcoes.tamanhoPadrao+"]")
                        .addClass("cabecalho-hide");
                }
            } else {
                $eu.addClass( "datagrid-tins-"+this.opcoes.tamanhoPadrao );                                                        //  seta o tamanho padrao
                if( this.opcoes.tamanhoPadrao != "larga")
                    $cabecalho_conteudo
                        .find("[class*=cabecalho-tamanho-"+this.opcoes.tamanhoPadrao+"]")
                        .addClass("cabecalho-hide");

            }

            $cabecalho_conteudo.find("> [class*=cabecalho-tamanho]")                                                                                                   //  remove class cabecalho-hide
                .each(function(){
                    $(this).addClass("collapse")
                });

            // atualiza informacao do botao
            this.cabecalho.botoes.grupoTela.botaoTela.titulo.html( this.opcoes.classesTamanhoTabela[ this.opcoes.tamanhoPadrao ] );

            return this;
        }
    };

    if (typeof $.fn.datagrid_tins === "undefined") {
        $.extend($.fn, {
            datagrid_tins: function (options) {
                var elemento = this[0];

                if (elemento.datagrid_tins) {
                    $.extend(elemento.datagrid_tins.opcoes, options);                                                  // adiciona as novas opcoes
                } else {
                    elemento.datagrid_tins = new DatagridTins(                                                          // inicializa o objeto
                        elemento,
                        $.extend({}, $.fn.datagrid_tins.defaults, options)
                    );
                }

                $(window)
                    .off('resize', elemento.datagrid_tins.resize )
                    .on('resize', {elemento: elemento}, elemento.datagrid_tins.resize);

                return elemento.datagrid_tins;                                                                          // retorna o objeto com os metodos, NAO CHAMA-O novamente
            }
        });

        // Configuration Defaults.
        $.fn.datagrid_tins.defaults = {
            identificacao: null,                                                                                        // usado para identificar de forma unica o datagrid

            autoAjuste: true,		                                                                        			// usar javascript para verificar o tamanho da tela

            classesTamanhoTabela: {                                                                         		    // opcional ['larga', 'grande', 'media', 'pequena']
                ' ': "Automático",
                'larga': "4 colunas",
                'grande': "3 colunas",
                'media': "2 colunas",
                'pequena': "1 coluna"
            },
            tamanhoPadrao: ' ', 		                                                                                // uma das de cima

            limiteTamanhoLarga: 2000,
            limiteTamanhoGrande: 1024,
            limiteTamanhoMedia: 970,
            limiteTamanhoPequena: 750,			                                                                        // tamanho para deteccao do conteiner

            // odem de cada grupoDeBotoesPadroes
            grupoNavegacao: "grupoCollapsePequena",
            grupoPesquisa: "grupoCollapseMedia",
            grupoAtualizar: "grupoCollapseGrande",
            grupoOrdenacao: "grupoCollapseGrande",
            grupoTela: "grupoCollapseLarga",

            grupoCollapsePequena : [],                                                                                  //    Espacos para o usuario adicionar botoes.
            grupoCollapseMedia : [],                                                                                    //    Necessario cada item possui a funcao RENDERIZAR
            grupoCollapseGrande : [],                                                                                   //    e que o retorno seja um objeto da DOM
            grupoCollapseLarga : [],                                                                                    //

            direcao: '-', 					                                                                            // '' ou '-'
            direcaoLabel: {
                '': 'Cresc -> Decres',	                                                                                     // Sera exibido de acordo as opcoes de 'direcao'
                '-': 'Decres -> Cresc'
            },

            totalPaginas: 1,          			                                                                        // quantidade de dados por pagina
            quantidadePorPagina: 30,			                                                                        // quantidade de dados por pagina
            pagina: 1,
            ordenadoPor: null,			    	                                                                        // nome do campo que serah ordenado (lista de dados)
            colunas: null,                                                                                              // [ ['label', 'Value'], ]      -> lista em listas, contendo o Label e Value
            url: null,                                                                                                  // url para requisicao
            buscar: "",
            dados: {},

            carregamentoRequisicao: "Carregando dados!",
            semDadosRequisicao: "Sem dados para serem exibidos!",
            erroRequisicao: "Um erro aconteceu ao tentar solicitar sua requisição!",
            funcaoRenderizadora: null,                                                                                  // e deve retornar um objeto HTML (lista, dicionario, container)

            // funcoes
            antesCarregados: null,				                                                                        // funcao que eh executada antes de carregar dados
            depoisCarregados: null,				                                                                        // funcao que eh executada quando carregado

            csrfmiddlewaretoken: ''                                                                                    // necessario para o HTTPS do django
        }; // $.fn.datagrid_tins.defaults


    } // if undefined
}(jQuery));
