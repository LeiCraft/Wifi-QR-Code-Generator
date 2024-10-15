import QRCode from 'qrcode';
import readline from 'readline';

// Function to generate high-resolution QR code
function generateWifiQRCodeToFile(
	ssid: string,
	password: string,
	encryption: 'WPA' | 'WEP' | '',
	hidden: boolean = false,
	filename: string = 'wifi-qr-code.png', // Default file name
	format: 'png' | 'svg' = 'png', // File format
	size: number = 1024 // Resolution of the image
) {
	// QR code string for Wi-Fi credentials
	const wifiQRCodeString = `WIFI:S:${ssid};T:${encryption};P:${password};H:${hidden ? 'true' : ''};;`;

	// Generate and save QR code as file
	QRCode.toFile(
		filename,
		wifiQRCodeString,
		{
			width: size, // Image resolution
			type: format // 'png' or 'svg'
		},
		(err) => {
			if (err) {
				console.error('Error generating QR code:', err);
			} else {
				console.log(`QR code saved as ${filename}`);
			}
		}
	);
}


function main() {

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	const questions = [
		'Enter SSID: ',
		'Enter Password: ',
		'Enter Encryption (WPA/WEP/leave empty for none): ',
		'Is the network hidden? (true/false): ',
		'Enter filename (default: wifi-qr-code.png): ',
		'Enter format (png/svg, default: png): ',
		'Enter size (default: 1024): '
	];

	const answers: string[] = [];

	function askQuestion(index: number) {
		if (index === questions.length) {
			const ssid = answers[0];
			const password = answers[1];
			const encryption = answers[2] as 'WPA' | 'WEP' | '';
			const hidden = answers[3].toLowerCase() === 'true';
			const filename = answers[4] || 'wifi-qr-code.png';
			const format = (answers[5] as 'png' | 'svg') || 'png';
			const size = parseInt(answers[6]) || 1024;

			generateWifiQRCodeToFile(ssid, password, encryption, hidden, filename, format, size);
			rl.close();
		} else {
			rl.question(questions[index], (answer) => {
				answers.push(answer);
				askQuestion(index + 1);
			});
		}
	};

	askQuestion(0);

}

main();

