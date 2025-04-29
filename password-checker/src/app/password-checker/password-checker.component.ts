import { Component } from '@angular/core';

@Component({
  selector: 'app-password-checker',
  standalone: false,
  templateUrl: './password-checker.component.html',
  styleUrl: './password-checker.component.css'
})
export class PasswordCheckerComponent {
  password = '';
  strengthText = '';
  strengthClass = '';
  scoreMax = 5;
  bars = Array(this.scoreMax).fill(0);


  checkStrength() {

    const pass = this.password;
    let score = 0;


    // 1. [GÜÇLÜ] En az 12 karakter olmalı
    if (pass.length >= 12) score++;

    // 2. [GÜÇLÜ] Büyük harf içermeli
    if (/[A-Z]/.test(pass)) score++;

    // 3. [GÜÇLÜ] Küçük harf içermeli
    if (/[a-z]/.test(pass)) score++;

    // 4. [GÜÇLÜ] Rakam içermeli
    if (/\d/.test(pass)) score++;

    // 5. [GÜÇLÜ] Özel karakter içermeli
    if (/[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\\/]/.test(pass)) score++;

    // 6. [ZAYIF] Sık kullanılan parolalar (OWASP listesi kısaltılmış)
    const common = ['password', '123456', 'admin', 'qwerty', 'welcome', 'abc123', 'iloveyou'];
    if (common.some(p => pass.toLowerCase().includes(p))) score = Math.max(score - 2, 0);

    // 7. [ZAYIF] Ardışık harfler (abc, def, qwerty)
    if (/abc|bcd|cde|def|efg|fgh|qwe|rty|asd|zxc/.test(pass.toLowerCase())) score = Math.max(score - 1, 0);;

    // 8. [ZAYIF] Ardışık sayılar (123, 456, 789)
    if (/012|123|234|345|456|567|678|789/.test(pass)) score = Math.max(score - 1, 0);;

    // 9. [ZAYIF] Aynı karakterin 3+ tekrar etmesi (aaa, 1111)
    if (/([a-zA-Z0-9])\1{2,}/.test(pass)) score = Math.max(score - 1, 0);;

    // 10. [ZAYIF] Sadece harf ya da sadece rakamdan oluşması
    if (/^[a-zA-Z]+$/.test(pass) || /^\d+$/.test(pass)) score = Math.max(score - 1, 0);;

    // 11. [ZAYIF] Doğum tarihi formatları (19xx, 20xx gibi)
    if (/(19|20)\d{2}/.test(pass)) score = Math.max(score - 1, 0);;

    // 12. [ZAYIF] Keyboard pattern içeriyor mu (asdf, qwerty, etc.)
    const keyboardPatterns = ['asdf', 'qwerty', 'zxcv', '1234', 'pass', 'login'];
    if (keyboardPatterns.some(p => pass.toLowerCase().includes(p))) score = Math.max(score - 1, 0);;

    // 13. [GÜÇLÜ] 3 farklı karakter türü içeriyor mu (örnek: harf + rakam + sembol)
    const varietyCheck = [
      /[a-z]/.test(pass),
      /[A-Z]/.test(pass),
      /\d/.test(pass),
      /[^a-zA-Z0-9]/.test(pass)
    ];
    if (varietyCheck.filter(Boolean).length >= 3) score++;

    // 14. [GÜÇLÜ] Benzersizlik: aynı karakter 2 defadan fazla tekrar etmiyor
    const uniqueChars = new Set(pass).size;
    if (uniqueChars >= pass.length - 2) score++;

    // 15. [GÜÇLÜ] Kelime içermiyor (dictionary word check – basit versiyon)
    const dictionaryWords = ['hello', 'love', 'sun', 'moon', 'home', 'name', 'city', 'job',
      '123456', '12345', 'şifre', '12345678', 'password', 'asdfgh', 'qwerty',
      'galatasaray', 'fenerbahce', 'besiktas', 'trabzon', 'ankara', 'istanbul',
      'mehmet', 'mustafa', 'ayşe', 'fatma', 'ahmet', 'ali', 'can', 'emre',
      'love', 'hello', 'sun', 'moon', 'home', 'admin', 'admin123', 'test',
      'deneme', 'giriş', 'root', 'kullanici', 'turkiye', 'dogum', '1990', '2000',
      'kanka', 'askim', 'asker', '123123', 'abc123', 'şifrem', 'şifrem123',
      'facebook', 'twitter', 'google', 'gmail', 'hotmail', 'telefon', 'telefonum',
      'parola', 'parolam', 'iloveyou', 'sevgi', 'sevgilim', 'aşk', 'seni', 'seviyorum',];
    if (dictionaryWords.some(w => pass.toLowerCase().includes(w))) score = Math.max(score - 1, 0);;

    //16. [GÜÇLÜ] Klavyenin üzerinden parmak kaydırılarak yazılan kelimeleri içermiyor
    const keyboardWalks = ['qwe', 'asd', 'zxc', '1qaz', 'qazwsx', 'poiuy', 'lkjhg', '2wsx','3edc', '4rfv',
      'qwertyuıopğü', 'asdfghjklşi', 'zxcvbnmöç'];
    if (keyboardWalks.some(seq => pass.toLowerCase().includes(seq))) {
      score = Math.max(score - 1, 0);
    }
    //17. [GÜÇLÜ] Tek tip karakter kullanılmıyor
    if ((pass.match(/./g)?.filter(c => c === pass[0]).length ?? 0) >= pass.length - 1) {
      score = Math.max(score - 1, 0);
    }
    //18. [ZAYIF] Tekrar eden patternlar var
    if (/^(.{1,4})\1+$/.test(pass)) {
      score = Math.max(score - 1, 0);
    }
    //19. [GÜÇLÜ] Hexadecimal veya binary formatındaki şifreler kabul olmamalı
    if (/^[01]{8,}$/.test(pass) || /^0x[0-9a-fA-F]+$/.test(pass)) {
      score = Math.max(score - 1, 0);
    }
    //20. Sadece özel karakter/emoji kullanımı kontrolü
    if (/^[^\w\s]+$/.test(pass)) {
      score = Math.max(score - 1, 0);
    }
   //21. Şifrede boşluk var mı kontrolü
    if (/\s/.test(pass)) {
      score = Math.max(score - 1, 0);
    }
    //22. Case Pattern (Sadece baş harfi mi büyük) kontrolü
    if (/^[A-Z][a-z]+[0-9]*$/.test(pass)) {
      score = Math.max(score - 1, 0);
    }

    score = Math.max(0, Math.min(score, this.scoreMax));

    if (pass.length < 12 && score > 3) {
      score = 2;
    }



    // this.bars = this.bars.map((_, i) => i < score ? 1 : 0);
    this.bars = Array(this.scoreMax).fill(0).map((_, i) => i < score ? 1 : 0);


    // Şifrenin zayıf/orta/güçlü olduğunu belirle
    switch (score) {
      case 0:
      case 1:
        this.strengthText = 'Çok zayıf 😞';
        this.strengthClass = 'very-weak';
        break;
      case 2:
        this.strengthText = 'Zayıf 😕';
        this.strengthClass = 'weak';
        break;
      case 3:
        this.strengthText = 'Orta 😐';
        this.strengthClass = 'medium';
        break;
      case 4:
        this.strengthText = 'Güçlü 🙂';
        this.strengthClass = 'strong';
        break;
      case 5:
        this.strengthText = 'Çok güçlü 😎';
        this.strengthClass = 'very-strong';
        break;
    }
  }

  resetPassword() {
    this.password = '';
    this.strengthText = '';
    this.strengthClass = '';
    this.bars = Array(5).fill(0);
  }

  getBarClass(index: number): string {
    if (this.bars[index]) {
      return this.strengthClass;
    }
    return 'empty';
  }
}


