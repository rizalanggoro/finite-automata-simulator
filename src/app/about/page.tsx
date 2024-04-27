import BreadCrumbComponent from "@/components/breadcrumb";
import ContainerComponent from "@/components/container";

export default function Page() {
  return (
    <>
      <ContainerComponent safeTop variant="sm" className="py-8">
        <BreadCrumbComponent
          items={[
            { href: "/", label: "Halaman Utama" },
            { href: "/about", label: "Tentang Program" },
          ]}
        />

        <p className="font-semibold text-3xl mt-4">Tentang Program</p>
        <div className="prose mt-2">
          <p>
            Program atau website Finite Automata Simulator ini kami buat untuk
            memenuhi tugas project mata kuliah Teori Bahasa dan Automata. Adapun
            beberapa orang yang terlibat dalam pembuatan algoritma dan website
            ini adalah sebagai berikut:
          </p>
          <ul>
            <li>Poltak Alfredo Philander Sitorus (L0122125)</li>
            <li>Rakhadito Wahyu Bassam (L0122134)</li>
            <li>Rizal Dwi Anggoro (L0122142)</li>
            <li>Syahlan Wigunatmo (L0122149)</li>
            <li>Rafly Amanta Haryanto (L0122158)</li>
          </ul>
          <br />
          <p>
            Detail dari tugas kelompok yang diberikan adalah sebagai berikut:
          </p>
          <ol>
            <li>
              Menerima input untuk NFA ataupun e-NFA kemudian mengubahnya
              menjadi DFA yang berkaitan.
            </li>
            <li>
              Menerima input berupa regular expression dan dapat mengenerate
              e-NFA yang berhubungan.
            </li>
            <li>
              Menerima input berupa sebuah DFA kemudian membuat jadi minimal,
              dimana user dapat memasukkan input berupa string untuk mengetes
              DFA tesebut, baik sebelum maupun sesudah dalam bentuk minimal.
            </li>
            <li>
              Menerima input berupa dua buah DFA, kemudian menunjukkan keduanya
              equivalen atau tidak.
            </li>
            <li>
              Mengetes DFA, NFA, e-NFA ataupun reguler expression dengan
              memasukkan input berupa string untuk mengetahui apakah string
              tersebut di accept atau di reject.
            </li>
          </ol>
        </div>
      </ContainerComponent>
    </>
  );
}
