import Cabecalho from './components/Cabecalho/Cabecalho.js';
import './App.css';
import Recursos from './components/Recursos/Recursos.js';
import Acoes from './components/Acoes/Acoes.js';
import {useState,useEffect} from 'react';
import Rodape from './components/Rodape/Rodape.js';


export default function App() {
  const [estoque, setEstoque] = useState({
    madeira: 0,
    ouro: 0,
    casa: 0,
    trabalhador: 0,
    comercio: 0
  });

  const [processos, setProcessos] = useState({
    cortar: 1,
    vender: 1
  });

  const [transacoes, setTransacoes] = useState({
    cortar: { madeira: 1 },
    vender: { madeira: -1, ouro: 1 },
    construir: { madeira: -5, ouro: -5, casa: +1 },
    contratarLenhador: { ouro: -10, casa: -1, trabalhador: 1 }
  });

  useEffect(() => {
    // Realiza transações a cada segundo
    const intervalo = setInterval(() => {
      executaTransacao("cortar", estoque.trabalhador * processos.cortar);
      executaTransacao("vender", estoque.comercio * processos.vender);
    }, 1000);
    return () => clearInterval(intervalo);
  });


  const handleClick = (e) => {
    const id = e.target.id;
    executaTransacao(id.slice(0, -3));
  };

  function executaTransacao(nomeTransacao, multiplicador = 1) {
    switch (nomeTransacao) {
      case "cortar":
        setEstoque((prevState) => ({ ...prevState,
			      madeira: prevState.madeira + transacoes.cortar.madeira * multiplicador}));
        break;
      case "vender":
        if (estoque.madeira >= transacoes.vender.madeira * -1 * multiplicador) {
          setEstoque((prevState) => ({ ...prevState,
				   madeira: prevState.madeira + transacoes.vender.madeira,
				   ouro: prevState.ouro + transacoes.vender.ouro * multiplicador}));
        }
        break;
        case "construir":
          if (estoque.madeira >= transacoes.construir.madeira * -1 * multiplicador
       && estoque.ouro >= transacoes.construir.ouro * -1 * multiplicador) {
            setEstoque((prevState) => ({ ...prevState, madeira: prevState.madeira + 
      transacoes.construir.madeira * multiplicador, ouro: prevState.ouro + 
      transacoes.construir.ouro * multiplicador , casa: prevState.casa + transacoes.construir.casa * multiplicador 
          }));
          }
          break;
        case "contratarLenhador":
          if (estoque.ouro >= transacoes.contratarLenhador.ouro * -1 * multiplicador
              && estoque.casa >= transacoes.contratarLenhador.casa * -1 * multiplicador) {
              setEstoque((prevState) => ({ ...prevState, ouro: prevState.ouro + 
                transacoes.contratarLenhador.ouro * multiplicador, casa: prevState.casa + 
                transacoes.contratarLenhador.casa * multiplicador, trabalhador: prevState.trabalhador + 
                transacoes.contratarLenhador.trabalhador * multiplicador }));
          }
          break;
    }
  };



  return (
    <div className="App">
      <Cabecalho />
      <Recursos estoque={estoque} />
      <Acoes transacoes={transacoes} handleClick={handleClick} />
      <Rodape estoque={estoque} transacoes={transacoes} processos={processos} />
      
    </div>
  );
}
