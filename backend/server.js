const express = require ("express");
const cors = require ("cors");
const Pool = require ("pg").Pool;

//Conexão com o banco de dados
const pool = new Pool ({

    user: "postgres",
    password: "root123",
    port: "5432",
    database: "dbInfoeduca"
});

const app = express();
app.use(cors());
app.use(express.json());

//Porta para rodar o servidor
app.listen(5000, () =>{
    console.log("Server rodando na porta 5000")
});

//Cadastrar Aluno
app.post("/cadastrar", async (req, res) => {

    try {
        const { nomeCompleto, dataNascimento, matricula, nomeResponsavelP, nomeResponsavelM, turma, emailResponsavel, celularResponsavel } = req.body;
        const novoAluno = await pool.query ("INSERT INTO alunos (nomecompleto , datanascimento , matricula , nomeresponsavelp , nomeresponsavelm , turma , emailresponsavel , celularresponsavel) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *", 
        [nomeCompleto, dataNascimento, matricula, nomeResponsavelP, nomeResponsavelM, turma, emailResponsavel, celularResponsavel]);
        
        res.json(novoAluno.rows[0]);

    } catch (err) {
        console.error(err.message);
    }

});


//Recuperar todos os Alunos
app.get("/alunos", async (req, res) => {
    try {
        const todosAlunos = await pool.query ("SELECT  * FROM alunos");
        
        res.json(todosAlunos.rows);

    } catch (err) {
        console.error(err.message);
    }
});

//Recuperar um Aluno em especifico
app.get("/alunos/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const aluno  = await pool.query ("SELECT * FROM alunos WHERE idAluno = $1", [id]);

        res.json (aluno.rows[0])

    } catch (err) {
        console.error(err.message);
    }
});

//Editar Aluno
app.put("/alunos/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const { nomeCompleto, dataNascimento, matricula, nomeResponsavelP, nomeResponsavelM, turma, emailResponsavel, celularResponsavel } = req.body;
        const editarAluno = await pool.query ("UPDATE alunos SET (nomecompleto , datanascimento , matricula , nomeresponsavelp , nomeresponsavelm , turma , emailresponsavel , celularresponsavel) = ($1, $2, $3, $4, $5, $6, $7, $8) WHERE idAluno = $9", 
        [nomeCompleto, dataNascimento, matricula, nomeResponsavelP, nomeResponsavelM, turma, emailResponsavel, celularResponsavel, id]);       

        res.json ("Os dados do aluno foram atualizados!");

    } catch (err) {
        console.error(err.message);
    }
});

//Excluir Aluno
app.delete("/alunos/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const excluirAluno  = await pool.query ("DELETE FROM alunos WHERE idAluno = $1", [id]);

        res.json ("Aluno excluido");

    } catch (err) {
        console.error(err.message);
    }
});

