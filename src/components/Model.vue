<template>
    <div class="relative bg-black" id="canvas" style="width: 100%; height: 100vh;">
        <a href="https://github.com/orhanemree/cografya-3d" class="absolute top-3 right-3 transition opacity-70 hover:opacity-50">
		    <svg class="w-8 fill-blue-400" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
	    </a>
        <div class="absolute bottom-3 right-3">
            <span class="text-white">Grid</span> <input checked type="checkbox" @click="toggleGrid()">
        </div>
        <router-link to="/" class="absolute top-2 left-2 transition opacity-70 hover:opacity-50">
		    <svg class="w-9 fill-blue-400" viewBox="0 0 24 24"><title>Home</title><path d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8h5z"></path></svg>
	    </router-link>
        
    </div>
</template>

<script>
import * as THREE from "three";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader.js"
import {MTLLoader} from "three/examples/jsm/loaders/MTLLoader.js"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"
import Footer from "./Footer.vue";

export default {
    name: "Model",
    components: {
        Footer,
    },
    data() {
        return {};
    },
    methods: {
        init: function () {
            const canvas = document.getElementById("canvas");
            this.camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 10000);
            this.camera.position.z = 250;
            this.scene = new THREE.Scene();
            this.camera.lookAt(this.scene.position);
            // Light
            const ambientLight = new THREE.AmbientLight(16777215);
            this.scene.add(ambientLight);
            // Grid Helper
            const gridHelper = new THREE.GridHelper(1000, 5);
            this.scene.add(gridHelper);
            // Loading and adding models
            const model = this.$route.params.model;
            document.title = `${model.replaceAll("_", " ")} - Coğrafya 3D`;
            const mtlLoader = new MTLLoader();
            mtlLoader.load(`/models/${model}/${model}.mtl`, materials => {
                materials.preload();
                const objLoader = new OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.load(`/models/${model}/${model}.obj`, object => {
                    object.scale.set(2, 2, 2);
                    this.scene.add(object);
                    console.log(object);
                    object.children.forEach(element => {
                        if (element.name === "water") {
                            element.material.transparent = true;
                            element.material.opacity = 0.9;
                        }
                    });
                });
            });
            this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
            canvas.appendChild(this.renderer.domElement);
            // Orbit Control
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        },
        animate: function () {
            requestAnimationFrame(this.animate);
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        },
        toggleGrid: function () {
            console.log(this.scene);
            this.scene.children[1].visible = !this.scene.children[1].visible;
        }
    },
    mounted() {
        this.init();
        this.animate();
    },
    components: { Footer }
}
</script>