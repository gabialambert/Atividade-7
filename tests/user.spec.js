const { test, expect } = require('@playwright/test');

function criarUsuario() {
  const id = Date.now() + Math.floor(Math.random() * 1000);
  const username = `gabriela_${id}`;

  return {
    id,
    username,
    firstName: 'Gabriela',
    lastName: 'Bomfim',
    email: `${username}@teste.com`,
    password: 'Teste123',
    phone: '11999999999',
    userStatus: 1
  };
}

async function cadastrarUsuario(request, user) {
  const response = await request.post('/v2/user', {
    data: user
  });

  expect(response.status()).toBe(200);
}

test.describe('API PetStore - User', () => {

  test('POST - cadastrar usuário', async ({ request }) => {
    const user = criarUsuario();

    const response = await request.post('/v2/user', {
      data: user
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.message).toBe(String(user.id));
  });

  test('GET - consultar usuário', async ({ request }) => {
    const user = criarUsuario();
    await cadastrarUsuario(request, user);

    const response = await request.get(
      `/v2/user/${user.username}`
    );

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.username).toBe(user.username);
    expect(body.firstName).toBe('Gabriela');
  });

  test('PUT - atualizar usuário', async ({ request }) => {
    const user = criarUsuario();
    await cadastrarUsuario(request, user);

    const updatedUser = {
      ...user,
      firstName: 'Gabriela Atualizada'
    };

    const response = await request.put(
      `/v2/user/${user.username}`,
      { data: updatedUser }
    );

    expect(response.status()).toBe(200);

    const consulta = await request.get(
      `/v2/user/${user.username}`
    );

    expect(consulta.status()).toBe(200);

    const body = await consulta.json();
    expect(body.firstName).toBe('Gabriela Atualizada');
  });

  test('DELETE - excluir usuário', async ({ request }) => {
    const user = criarUsuario();
    await cadastrarUsuario(request, user);

    const response = await request.delete(
      `/v2/user/${user.username}`
    );

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.message).toBe(user.username);
  });

});