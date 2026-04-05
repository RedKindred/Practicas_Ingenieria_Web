const form      = document.getElementById("form-login");
const resultado = document.getElementById("msg");
const campos    = ["log-user", "log-email", "log-pass"];

function validarCampo(id) {
    const input = document.getElementById(id);
    const error = document.getElementById("error-" + id);

    if (!input || !error) return true;

    error.textContent = "";
    input.classList.remove("valido", "invalido");

    /* campo obligatorio */
    if (input.required && input.validity.valueMissing) {
        error.textContent = "Este campo es obligatorio";
        input.classList.add("invalido");
        return false;
    }

    /* pattern */
    if (input.validity.patternMismatch) {
        const mensajes = {
            "log-user": "El usuario debe tener entre 3 y 20 letras (sin espacios ni números)",
            "log-pass": "Mínimo 8 caracteres: una mayúscula, una minúscula y un número"
        };

        error.textContent = mensajes[id] || "Formato inválido";
        input.classList.add("invalido");
        return false;
    }

    /* email */
    if (input.validity.typeMismatch) {
        error.textContent = "Correo electrónico inválido";
        input.classList.add("invalido");
        return false;
    }

    input.classList.add("valido");
    return true;
}

/* eventos en inputs */
campos.forEach(id => {
    const input = document.getElementById(id);

    if (!input) return;

    input.addEventListener("blur",  () => validarCampo(id));
    input.addEventListener("input", () => validarCampo(id));
});

/* submit */
form.addEventListener("submit", async function(e) {
    let valido = true;
    e.preventDefault();
    campos.forEach(id => {
        if (!validarCampo(id)) {
            valido = false;
        }
    });

    if (!valido) {
        return;
    }

    const datos = {
        Usuario:    document.getElementById("log-user").value.trim(),
        correo:     document.getElementById("log-email").value.trim(),
        contraseña: document.getElementById("log-pass").value
    };

    const response = await fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    const resultadoServidor = await response.json();

    if (!resultadoServidor.ok) {
        alert(resultadoServidor.mensaje); // alert si el usuario no existe o credenciales incorrectas
    } else {
          window.location.href = "/dashboard"
    }
});
