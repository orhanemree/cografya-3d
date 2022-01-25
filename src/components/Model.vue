<template>
    <div class="relative bg-black" id="canvas" style="width: 100%; height: 100vh;">
        <div class="absolute bottom-3 right-3">
            <span class="text-white">Grid</span> <input checked type="checkbox" @click="toggleGrid()">
        </div>
    </div>
</template>

<script>
import * as THREE from "three";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader.js"
import {MTLLoader} from "three/examples/jsm/loaders/MTLLoader.js"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"

export default {
    name: "Model",
    data(){
        return{}
    },
    methods: {
        init: function(){
            const canvas = document.getElementById("canvas");

            this.camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, .1, 10000);
            this.camera.position.z = 250;

            this.scene = new THREE.Scene();
            this.camera.lookAt(this.scene.position);

            // Light
            const ambientLight = new THREE.AmbientLight(0xffffff);
            this.scene.add(ambientLight);

            // Grid Helper
            const gridHelper = new THREE.GridHelper(1000, 5);
            this.scene.add(gridHelper);

            // Loading and adding models
            const model = this.$route.params.model;
            document.title = `${model.replaceAll("_", " ")} - Coğrafya 3D`

            const mtlLoader = new MTLLoader();
            mtlLoader.load(`/models/${model}/${model}.mtl`, materials => {
                materials.preload();
                const objLoader = new OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.load(`/models/${model}/${model}.obj`, object => {
                    object.scale.set(2, 2, 2);
                    this.scene.add(object);
                    console.log(object)
                    object.children.forEach(element => {
                        if (element.name === "water"){
                            element.material.transparent = true;
                            element.material.opacity = .7;
                        }
                    });
                });
            });

            this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
            this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);

            canvas.appendChild(this.renderer.domElement);

            // Orbit Control
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        },
        animate: function(){
            requestAnimationFrame(this.animate);
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        },
        toggleGrid: function(){
            console.log(this.scene)
            this.scene.children[1].visible = !this.scene.children[1].visible;
        }
    },
    mounted() {
        this.init();
        this.animate();
    }
}
</script>