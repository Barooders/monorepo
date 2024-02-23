export const floaResultPage = (checkoutUrl: string) => `<head>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap"
		rel="stylesheet">
	<style>
		* {
			font-family: 'Poppins';
		}
	</style>
</head>

<body>
	<div
		style="display: flex; flex-direction: column; align-items: center; max-width: 800px; padding: 20px 12px; margin: auto;">
		<img
			src="https://cdn.shopify.com/s/files/1/0637/4771/9409/files/logo_rouge_a6fa931e-f71c-470e-9d04-bfd7a624921a_x320.png"
			width="300" height="30" alt="Barooders">
		<p style="text-align: center; margin-top: 30px; line-height: 1.5;">
			Votre demande de paiement est terminée, vous allez être redirigé vers votre commande sur Barooders dans quelques instants.
		</p>

		<p style="font-style: italic; margin-top: 50px; text-align: center;">
			Si vous n'êtes pas redirigé, <a href="${checkoutUrl}">cliquez ici</a> pour accéder à votre commande
		</p>
	<div>
	<script>
		window.setTimeout(() => {
			window.location.href = "${checkoutUrl}";
		}, 4000)
	</script>
</body>
`;
