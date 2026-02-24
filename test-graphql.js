// Test de connexion GraphQL
// Ouvrez ce fichier dans la console du navigateur pour tester

const testLogin = async () => {
    const query = `
    mutation {
      login(
        email: "superadmin@exemple.com"
        password: "SuperAdminPass123!"
      ) {
        token
        user {
          id
          email
          firstName
          lastName
          role
        }
      }
    }
  `;

    try {
        const response = await fetch('https://eduhive-backend-cfa1.onrender.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query })
        });

        const result = await response.json();
        console.log('Test login result:', result);
        return result;
    } catch (error) {
        console.error('Test login error:', error);
    }
};

// Exécutez cette fonction dans la console
console.log('Pour tester la connexion, tapez: testLogin()');
