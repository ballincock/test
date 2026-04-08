            class UI {
                static
                switch (target) {
                    document.querySelectorAll('form').forEach(f => f.classList.add('hidden'));
                    document.querySelectorAll('.tabs button').forEach(b => b.classList.remove('active'));

                    document.getElementById(`form-${target}`).classList.remove('hidden');
                    document.getElementById(`tab-${target}`).classList.add('active');
                }

                static showModal(html) {
                    document.getElementById('modal-body').innerHTML = html;
                    document.getElementById('modal-overlay').style.display = 'flex';
                }
                static closeModal() {
                    document.getElementById('modal-overlay').style.display = 'none';
                }
            }
            class AuthAPI {
                static async submit(e, action) {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    formData.append('action', action);

                    if (action === 'register') {
                        if (document.getElementById('reg-p1').value !== document.getElementById('reg-p2').value) {
                            return UI.showModal("<span style='color:red'>Passwords do not match!</span>");
                        }
                    }

                    try {
                        const response = await fetch('api.php', {
                            method: 'POST',
                            body: formData
                        });
                        const result = await response.json();

                        let output = `<h3>${result.status.toUpperCase()}</h3><p>${result.message}</p>`;

                        if (result.mnemonic) {
                            output += `<div style="background:#eee; padding:10px; font-size:0.8rem; text-align:left;">
                      <strong>Mnemonic:</strong> ${result.mnemonic}<br><br>
                      <strong>Secure Key:</strong> ${result.secure_key}
                    </div><p><em>Save these! You cannot recover your account without them.</em></p>`;
                        }

                        UI.showModal(output);
                    } catch (err) {
                        UI.showModal("Critical Error: Could not connect to API.");
                    }
                }
            }

            document.addEventListener('DOMContentLoaded', () => {
                const settingsBtn = document.getElementById('btn-settings');
                const dmsBtn = document.getElementById('btn-dms');

                settingsBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Toggle Settings Page');
                });

                dmsBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Toggle DMs Page');
                });
            });
            document.getElementById('form-login').onsubmit = (e) => AuthAPI.submit(e, 'login');
            document.getElementById('form-register').onsubmit = (e) => AuthAPI.submit(e, 'register');
            document.getElementById('form-forgot').onsubmit = (e) => AuthAPI.submit(e, 'forgot');
