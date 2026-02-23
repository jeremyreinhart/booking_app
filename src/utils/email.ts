import nodemailer from "nodemailer";
import "dotenv/config";
import { AppError } from "../errors/AppError";

const transporter = nodemailer.createTransport({
  // service: process.env.MAIL_SERVICE,
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const createEmail = (
  email: string,
  fieldName: string,
  startTime: Date,
  endTime: Date,
  price: number,
) => {
  // 1. Format data untuk isi pesan WhatsApp
  const tgl = startTime.toLocaleDateString("id-ID");
  const jam = `${startTime.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} - ${endTime.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;
  const total = `Rp ${price.toLocaleString("id-ID")}`;

  const waText = `Halo Admin FutsalHub, saya ingin konfirmasi booking:
Nama Lapangan: ${fieldName}
Tanggal: ${tgl}
Waktu: ${jam}
Total: ${total}

Mohon diproses, terima kasih.`;

  // 2. Encode teks agar aman masuk ke link URL
  const encodedWaText = encodeURIComponent(waText);
  const waNumber = "6285860310399";
  const waLink = `https://wa.me/${waNumber}?text=${encodedWaText}`;

  return {
    from: `"FutsalHub" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Konfirmasi Booking Lapangan Futsal",
    html: `
      <div style="font-family: sans-serif; line-height: 1.6;">
        <h2 style="color: #2c3e50;">Booking Berhasil!</h2>
        <p>Detail pesanan Anda:</p>
        <table style="width: 100%; max-width: 400px; border-collapse: collapse;">
          <tr><td><b>Lapangan</b></td><td>: ${fieldName}</td></tr>
          <tr><td><b>Tanggal</b></td><td>: ${tgl}</td></tr>
          <tr><td><b>Waktu</b></td><td>: ${jam}</td></tr>
          <tr><td><b>Total</b></td><td>: <b>${total}</b></td></tr>
        </table>
        
        <p>Untuk menyelesaikan pembayaran, silakan klik tombol di bawah ini untuk konfirmasi ke WhatsApp Admin:</p>
        
        <a href="${waLink}" 
           style="background-color: #25D366; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
           Konfirmasi via WhatsApp
        </a>
      </div>
    `,
  };
};

export const sendEmail = async (
  email: string,
  fieldName: string,
  startTime: Date,
  endTime: Date,
  price: number,
) => {
  return transporter.sendMail(
    createEmail(email, fieldName, startTime, endTime, price),
  );
};
