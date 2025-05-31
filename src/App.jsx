import { useState, useEffect } from "react"; 
import Guitar from "./components/guitar";
import Header  from "./components/header";
import { db } from "./data/db";

function App() {

  const initialCart = () => {
    //return JSON.parse(localStorage.getItem('cart'))

    const localStorageCart = localStorage.getItem('cart');
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  }

  const [data] = useState(db)  
  const [cart, setCart] = useState(initialCart);

  const MAX_ITEMS = 5; // Cantidad máxima de items que se pueden agregar al carrito
  const MIN_ITEMS = 1; // Cantidad máxima de items que se pueden agregar al carrito


  // Se ejecuta este useEffect cada vez que la variable cart cambia.
  useEffect(() => {
  
    localStorage.setItem('cart', JSON.stringify(cart)); // Inicializa el localStorage si no existe
    
  }, [cart]);


  function addToCart(items){
    
    // Si existe devuelve la posicion del Index, si en caso no existe devuelve -1
    const itemExists = cart.findIndex( guitar => guitar.id === items.id);

    if(itemExists !== -1){        
        console.log("SI existe, se procede a actualizar la cantidad");
        if(cart[itemExists].quantity >= MAX_ITEMS) return // Si la cantidad es mayor o igual a 5, no se puede agregar más
        
        const updatedCart = [...cart]; // Creamos una copia del carrito actual
        updatedCart[itemExists].quantity += 1; // Actualizamos la cantidad
        setCart(updatedCart); // Actualizamos el estado del carrito
    }
    else{
        console.log("NO existe, se procede a agregar");
        items.quantity = 1; // Agregamos la cantidad por defecto
        //setCart(prevCart => [...prevCart, items]);
        setCart([...cart, items]);
    }
    // saveLocalStorage() // Ya se actualiza en el UseEffect
  }

  function removeFromCart(id) {
    console.log("Eliminando del carrito",id);
    setCart(prevCart => prevCart.filter(guitar => guitar.id !== id));
    return
  }

  function incrementando(id){
    const updatedCart = cart.map(item => {
      if (item.id === id && item.quantity < MAX_ITEMS) { // Verifica que la cantidad sea menor a 10
        return { ...item, quantity: item.quantity + 1 }; // Incrementa la cantidad
      }
      return item; // Retorna el item sin cambios
    });

    setCart(updatedCart); // Actualiza el estado del carrito    
  };

    function decrementando(id){
      console.log("Decrementando cantidad del item con id:", id);
      const updatedCart = cart.map(item => {
      if (item.id === id && item.quantity > MIN_ITEMS) {          // Verifica que la cantidad sea hasta 0
        return { ...item, quantity: item.quantity - 1 };  // Decrementa la cantidad
      }
      return item; // Retorna el item sin cambios
    });

    setCart(updatedCart); // Actualiza el estado del carrito    

  };


  function cleanCart() {
    console.log("Limpiando el carrito");
    setCart([]); // Limpia el carrito
  }

// function saveLocalStorage() {
//   localStorage.setItem('cart', JSON.stringify(cart));
// }

  
  return (
    <>
        <Header 
            cart={cart}
            removeFromCart={removeFromCart}
            incrementando={incrementando}
            decrementando={decrementando}
            cleanCart={cleanCart}
        />
               
        <main className="container-xl mt-5">
            <h2 className="text-center">Nuestra Colección</h2>

            <div className="row mt-5">
                {data.map(guitar => (
                    <Guitar 
                        key={guitar.id}
                        guitar={guitar}                                                        
                        addToCart={addToCart}                                   
                    />
                ))}              
            </div>
        </main>


        <footer className="bg-dark mt-5 py-5">
            <div className="container-xl">
                <p className="text-white text-center fs-4 mt-4 m-md-0">Derechos Reservados - Full Stack Dev JC PONTE</p>
            </div>
        </footer>

    </>
  )
}

export default App
